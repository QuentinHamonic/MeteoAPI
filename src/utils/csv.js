import { fileURLToPath } from "node:url";
import { readFile, writeFile } from 'node:fs/promises';

function parserLigneCSV(ligne, separateur) {
    const colonnes = [];
    let valeur = '';

    for (let i = 0; i < ligne.length; i++) {
        const caractere = ligne[i];
        if (caractere === separateur) {
            colonnes.push(valeur);
            valeur = '';
        } else {
            valeur += caractere;
        }
    }
    colonnes.push(valeur);
    return colonnes;
}

/**
 * Lit et parse le fichier CSV des relevés météo.
 * Ignore la ligne d'en-tête et toute ligne dont une colonne est manquante ou invalide.
 * @param {string} CheminCsv - Chemin absolu vers le fichier CSV.
 * @returns {Promise<Object[]>} La liste des relevés, avec un id généré (index + 1).
 */
export async function parseCsv(CheminCsv) {
    //console.log(CheminCsv)
    const csv = await readFile(CheminCsv, "utf-8");

    // La première ligne est l'en-tête — on la saute
    const lignes = csv.split('\n').filter(l => l.trim());
    const separateur = lignes[0]?.includes(';') ? ';' : ',';

    return lignes.slice(1).map((ligne, index) => {

        const colonnes = parserLigneCSV(ligne, separateur)
        return {
            id: index + 1,
            ville: colonnes[0]?.trim() ?? '',
            date: colonnes[1]?.trim() ?? '',
            temperature_min: parseInt(colonnes[2]?.trim() ?? ''),
            temperature_max: parseInt(colonnes[3]?.trim() ?? ''),
            description: colonnes[4]?.trim() ?? '',
            humidite: parseInt(colonnes[5]?.trim() ?? '')
        };
    }).filter(mesure => mesure.ville && mesure.date && !isNaN(mesure.temperature_min) &&
         !isNaN(mesure.temperature_max) && mesure.description && !isNaN(mesure.humidite));
}

/**
 * Réécrit le fichier CSV à partir de la liste des relevés (sans la colonne id, absente du CSV).
 * @param {string} cheminCsv - Chemin absolu vers le fichier CSV des relevés.
 * @param {Object[]} releves - La liste complète des relevés à persister.
 * @returns {Promise<void>}
 */
export async function writeCsv(cheminCsv, releves) {
    const entete = 'ville;date;temperature_min;temperature_max;description;humidite';

    const lignes = releves.map(releve => [
        releve.ville,
        releve.date,
        releve.temperature_min,
        releve.temperature_max,
        releve.description,
        releve.humidite
    ].join(';'));

    const contenu = [entete, ...lignes].join('\n') + '\n';

    await writeFile(cheminCsv, contenu, 'utf-8');
}

