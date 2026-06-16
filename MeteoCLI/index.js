import * as readline from 'node:readline/promises';
const BASE = process.env.API_URL ?? "http://localhost:3000";


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let quitter = false;

while (!quitter) {
    console.log("\n1. Lister les relevés");
    console.log("2. Chercher par id");
    console.log("3. Creer un relevé");
    console.log("4. Quitter");


    const choix = await rl.question("> ");

    switch (choix.trim()) {
        case "1":
            try {
                const res_all = await fetch(`${BASE}/releves`);
                if (!res_all.ok) {
                    console.error("Erreur API :", res_all.status);
                    break;
                }
                const releves_all = await res_all.json();
                console.table(releves_all);
            } catch (e) {
                console.error("Impossible de joindre l'API : ", e.message)
            }

            break;
        case "2":
            try {
                const choix_id = await rl.question("ID ? > ");
                const res_id = await fetch(`${BASE}/releves/${choix_id}`);
                if (res_id.status === 404) {
                    console.error("Relevé introuvable.");
                    break;
                }
                if (!res_id.ok) {
                    console.error("Erreur API :", res_id.status);
                    break;
                }
                const releve_id = await res_id.json();
                console.table(releve_id);
            } catch (e) {
                console.error("Impossible de joindre l'API : ", e.message)
            }

            break;
        case "3":
            const choix_Ville = await rl.question("Ville ? > ");
            const choix_Date = await rl.question("Date ? format (année-mois-jour) > ");
            const choix_Temperature_min = await rl.question("Temperature_min ? > ");
            const choix_Temperature_max = await rl.question("Temperature_max ? > ");
            const choix_Description = await rl.question("Description ? > ");
            const choix_Humidite = await rl.question("Humidite ? entre 0 et 100> ");

            if (!choix_Ville.trim() || !choix_Date.trim() || !choix_Description.trim()) {
                console.error("Tous les champs texte sont obligatoires.");
                break;
            }

            const temp_min = Number(choix_Temperature_min);
            const temp_max = Number(choix_Temperature_max);
            const humidite = Number(choix_Humidite);

            if (isNaN(temp_min) || isNaN(temp_max) || isNaN(humidite)) {
                console.error("Température et humidité doivent être des nombres.");
                break;
            }

            const res_cr = await fetch(`${BASE}/releves`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ville: choix_Ville, date: choix_Date, temperature_min: temp_min,
                    temperature_max: temp_max, description: choix_Description, humidite
                }),
            });
            if (res_cr.status === 201) {
                const releve = await res_cr.json();
                console.log("Relevé créé avec l'id : ", releve);

            }
            else if (res_cr.status === 400) {
                const { erreurs } = await res_cr.json();
                console.error("Données invalide :", erreurs);
            }
            else {
                console.error("Erreur API :", res_cr.status);
            }
            break;
        case "4": quitter = true; break;
        default: console.log("Choix invalide");
    }
}
rl.close();
