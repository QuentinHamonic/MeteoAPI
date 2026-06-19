import Database from "better-sqlite3";
import { config } from "./config.js";
import { parseCsv } from "./utils/csv.js";

// Connexion SQLite (synchrone). En cas d'échec, on log et on propage :
// le serveur ne doit pas démarrer sur une base inutilisable.
let db;
try {
    db = new Database(config.cheminDb);
    db.pragma("journal_mode = WAL"); // meilleure robustesse en lecture/écriture concurrentes
} catch (err) {
    console.error(`Impossible d'ouvrir la base SQLite (${config.cheminDb}) :`, err.message);
    throw err;
}

// Schéma : créé une seule fois si absent. L'id est auto-incrémenté par SQLite.
db.exec(`
    CREATE TABLE IF NOT EXISTS releves (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        ville           TEXT NOT NULL,
        date            TEXT NOT NULL,
        temperature_min REAL NOT NULL,
        temperature_max REAL NOT NULL,
        description     TEXT NOT NULL,
        humidite        REAL NOT NULL
    )
`);

/**
 * Importe les relevés du CSV dans la base si celle-ci est vide.
 * Opération idempotente : sans effet si la table contient déjà des données.
 * @returns {Promise<void>}
 */
export async function initialiserDb() {
    const { total } = db.prepare("SELECT COUNT(*) AS total FROM releves").get();
    if (total > 0) {
        console.log(`Base SQLite prête : ${total} relevés présents`);
        return;
    }

    const releves = await parseCsv(config.cheminCsv);
    const insert = db.prepare(`
        INSERT INTO releves (ville, date, temperature_min, temperature_max, description, humidite)
        VALUES (@ville, @date, @temperature_min, @temperature_max, @description, @humidite)
    `);
    // Transaction : tout ou rien, et bien plus rapide qu'insérer ligne par ligne.
    const importer = db.transaction((lignes) => {
        for (const r of lignes) insert.run(r);
    });
    importer(releves.map(({ ville, date, temperature_min, temperature_max, description, humidite }) =>
        ({ ville, date, temperature_min, temperature_max, description, humidite })));

    console.log(`Base SQLite initialisée : ${releves.length} relevés importés depuis le CSV`);
}

export default db;
