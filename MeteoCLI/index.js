import * as readline from 'node:readline/promises';

const BASE = process.env.API_URL ?? "http://localhost:3000";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// ── Couleurs ANSI ────────────────────────────────────────────────────────────
const c = {
    reset:  '\x1b[0m',
    bold:   '\x1b[1m',
    dim:    '\x1b[2m',
    cyan:   '\x1b[36m',
    green:  '\x1b[32m',
    red:    '\x1b[31m',
    yellow: '\x1b[33m',
    blue:   '\x1b[34m',
};
const fmt = {
    titre: (s) => `${c.bold}${c.cyan}${s}${c.reset}`,
    ok:    (s) => `${c.green}${s}${c.reset}`,
    err:   (s) => `${c.red}${s}${c.reset}`,
    info:  (s) => `${c.yellow}${s}${c.reset}`,
    dim:   (s) => `${c.dim}${s}${c.reset}`,
};

// ── Helpers ──────────────────────────────────────────────────────────────────
async function api(path, options = {}) {
    try {
        return await fetch(`${BASE}${path}`, options);
    } catch (e) {
        console.error(fmt.err(`\n✗ Impossible de joindre l'API : ${e.message}`));
        return null;
    }
}

async function pauserEntrée() {
    await rl.question(fmt.dim('\nAppuie sur Entrée pour continuer...'));
}

function afficherEntete(section = '') {
    console.clear();
    console.log(fmt.titre('╔══════════════════════════════╗'));
    console.log(fmt.titre('║        🌤  MétéoCLI           ║'));
    console.log(fmt.titre('╚══════════════════════════════╝'));
    console.log(fmt.dim(`  API : ${BASE}`));
    if (section) console.log(fmt.titre(`\n── ${section} ${'─'.repeat(Math.max(0, 28 - section.length))}`));
    console.log();
}

function afficherErreurs(erreurs) {
    console.error(fmt.err('\n✗ Données invalides :'));
    erreurs.forEach(e => console.error(fmt.err(`  · ${e}`)));
}

function collecterChamps() {
    return {
        async texte(label) { return rl.question(`  ${label.padEnd(20)} > `); },
        async nombre(label) { return rl.question(`  ${label.padEnd(20)} > `); },
    };
}

// ── Relevés ──────────────────────────────────────────────────────────────────
async function listerReleves() {
    const res = await api('/releves');
    if (!res) return;
    if (!res.ok) { console.error(fmt.err(`✗ Erreur API : ${res.status}`)); return; }
    const releves = await res.json();
    console.table(releves);
    console.log(fmt.ok(`\n✓ ${releves.length} relevé(s)`));
}

async function chercherReleve() {
    const id = await rl.question('  ID > ');
    const res = await api(`/releves/${id.trim()}`);
    if (!res) return;
    if (res.status === 404) { console.log(fmt.err('\n✗ Relevé introuvable.')); return; }
    if (!res.ok) { console.error(fmt.err(`✗ Erreur API : ${res.status}`)); return; }
    console.table(await res.json());
}

async function saisirReleve() {
    const champs = collecterChamps();
    console.log(fmt.info('  Remplissez les champs :\n'));
    const ville        = await champs.texte('Ville');
    const date         = await champs.texte('Date (YYYY-MM-DD)');
    const temp_min_s   = await champs.nombre('Temp. min (°C)');
    const temp_max_s   = await champs.nombre('Temp. max (°C)');
    const description  = await champs.texte('Description');
    const humidite_s   = await champs.nombre('Humidité (%)');

    if (!ville.trim() || !date.trim() || !description.trim()) {
        console.error(fmt.err('\n✗ Tous les champs texte sont obligatoires.'));
        return null;
    }
    const temperature_min = Number(temp_min_s);
    const temperature_max = Number(temp_max_s);
    const humidite        = Number(humidite_s);

    if (isNaN(temperature_min) || isNaN(temperature_max) || isNaN(humidite)) {
        console.error(fmt.err('\n✗ Température et humidité doivent être des nombres.'));
        return null;
    }
    return { ville, date, temperature_min, temperature_max, description, humidite };
}

async function creerReleve() {
    const donnees = await saisirReleve();
    if (!donnees) return;

    const res = await api('/releves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donnees),
    });
    if (!res) return;
    if (res.status === 201) {
        const id = await res.json();
        console.log(fmt.ok(`\n✓ Relevé créé avec l'id : ${id}`));
    } else if (res.status === 400) {
        afficherErreurs((await res.json()).erreurs);
    } else {
        console.error(fmt.err(`\n✗ Erreur API : ${res.status}`));
    }
}

async function modifierReleve() {
    const id = await rl.question('  ID du relevé à modifier > ');
    const check = await api(`/releves/${id.trim()}`);
    if (!check) return;
    if (check.status === 404) { console.log(fmt.err('\n✗ Relevé introuvable.')); return; }

    const donnees = await saisirReleve();
    if (!donnees) return;

    const res = await api(`/releves/${id.trim()}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donnees),
    });
    if (!res) return;
    if (res.ok) {
        console.log(fmt.ok(`\n✓ Relevé ${id.trim()} mis à jour.`));
    } else if (res.status === 400) {
        afficherErreurs((await res.json()).erreurs);
    } else {
        console.error(fmt.err(`\n✗ Erreur API : ${res.status}`));
    }
}

async function supprimerReleve() {
    const id      = await rl.question('  ID du relevé à supprimer > ');
    const confirm = await rl.question(fmt.err(`  Confirmer la suppression du relevé ${id.trim()} ? (o/N) > `));
    if (confirm.trim().toLowerCase() !== 'o') { console.log(fmt.dim('\n  Annulé.')); return; }

    const res = await api(`/releves/${id.trim()}`, { method: 'DELETE' });
    if (!res) return;
    if (res.status === 204) {
        console.log(fmt.ok(`\n✓ Relevé ${id.trim()} supprimé.`));
    } else if (res.status === 404) {
        console.error(fmt.err('\n✗ Relevé introuvable.'));
    } else {
        console.error(fmt.err(`\n✗ Erreur API : ${res.status}`));
    }
}

async function menuReleves() {
    let retour = false;
    while (!retour) {
        afficherEntete('Relevés');
        console.log('  1. Lister tous les relevés');
        console.log('  2. Chercher par id');
        console.log('  3. Créer un relevé');
        console.log('  4. Modifier un relevé');
        console.log('  5. Supprimer un relevé');
        console.log(fmt.dim('  0. Retour'));
        console.log();

        const choix = await rl.question('> ');
        switch (choix.trim()) {
            case '1': await listerReleves(); await pauserEntrée(); break;
            case '2': await chercherReleve(); await pauserEntrée(); break;
            case '3': await creerReleve(); await pauserEntrée(); break;
            case '4': await modifierReleve(); await pauserEntrée(); break;
            case '5': await supprimerReleve(); await pauserEntrée(); break;
            case '0': retour = true; break;
            default:  console.log(fmt.err('  Choix invalide')); await pauserEntrée();
        }
    }
}

// ── Villes ───────────────────────────────────────────────────────────────────
async function listerVilles() {
    const res = await api('/villes');
    if (!res) return;
    if (!res.ok) { console.error(fmt.err(`✗ Erreur API : ${res.status}`)); return; }
    const villes = await res.json();
    console.table(villes);
    console.log(fmt.ok(`\n✓ ${villes.length} ville(s)`));
}

async function relevesParVille() {
    const ville = await rl.question('  Ville > ');
    const res = await api(`/villes/${encodeURIComponent(ville.trim())}`);
    if (!res) return;
    if (res.status === 404) { console.log(fmt.err('\n✗ Ville introuvable.')); return; }
    if (!res.ok) { console.error(fmt.err(`✗ Erreur API : ${res.status}`)); return; }
    const releves = await res.json();
    console.table(releves);
    console.log(fmt.ok(`\n✓ ${releves.length} relevé(s) pour ${ville.trim()}`));
}

async function menuVilles() {
    let retour = false;
    while (!retour) {
        afficherEntete('Villes');
        console.log('  1. Lister toutes les villes');
        console.log('  2. Relevés d\'une ville');
        console.log(fmt.dim('  0. Retour'));
        console.log();

        const choix = await rl.question('> ');
        switch (choix.trim()) {
            case '1': await listerVilles(); await pauserEntrée(); break;
            case '2': await relevesParVille(); await pauserEntrée(); break;
            case '0': retour = true; break;
            default:  console.log(fmt.err('  Choix invalide')); await pauserEntrée();
        }
    }
}

// ── Stats ────────────────────────────────────────────────────────────────────
async function afficherStats() {
    afficherEntete('Statistiques globales');
    const res = await api('/stats');
    if (!res) return;
    if (!res.ok) { console.error(fmt.err(`✗ Erreur API : ${res.status}`)); return; }
    const stats = await res.json();

    console.log(`  Relevés total     : ${fmt.info(stats.nombreTotalReleves)}`);
    console.log(`  Villes            : ${fmt.info(stats.nombreVilles)}`);
    console.log(`  Temp. min absolue : ${fmt.info(stats.temperatureMinAbsolue + ' °C')}`);
    console.log(`  Temp. max absolue : ${fmt.info(stats.temperatureMaxAbsolue + ' °C')}`);
    console.log(`  Temp. moyenne     : ${fmt.info(stats.temperatureMoyenne + ' °C')}`);
    console.log(`  Humidité moyenne  : ${fmt.info(stats.humiditeMoyenne + ' %')}`);
    console.log(`  Villes + humides  : ${fmt.info((stats.villesPlusHumides ?? []).join(', '))}`);
    console.log(`  Villes + chaudes  : ${fmt.info((stats.villesPlusChaudes ?? []).join(', '))}`);
    await pauserEntrée();
}

// ── Menu principal ────────────────────────────────────────────────────────────
let quitter = false;
while (!quitter) {
    afficherEntete();
    console.log('  1. Relevés');
    console.log('  2. Villes');
    console.log('  3. Statistiques');
    console.log(fmt.dim('  0. Quitter'));
    console.log();

    const choix = await rl.question('> ');
    switch (choix.trim()) {
        case '1': await menuReleves(); break;
        case '2': await menuVilles(); break;
        case '3': await afficherStats(); break;
        case '0': quitter = true; break;
        default:  console.log(fmt.err('  Choix invalide')); await pauserEntrée();
    }
}

console.log(fmt.ok('\n  À bientôt ! 🌤\n'));
rl.close();
process.exit(0);
