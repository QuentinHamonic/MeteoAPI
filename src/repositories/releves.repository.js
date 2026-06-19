import db from "../db.js";

/**
 * Accès aux données des relevés météo, stockées dans une base SQLite.
 * Les méthodes restent `async` pour préserver le contrat attendu par le service,
 * même si better-sqlite3 est synchrone.
 */
export class ReleveRepository {
    // Requêtes préparées une fois, réutilisées à chaque appel.
    #selectAll  = db.prepare("SELECT * FROM releves ORDER BY id");
    #selectById = db.prepare("SELECT * FROM releves WHERE id = ?");
    #insert     = db.prepare(`
        INSERT INTO releves (ville, date, temperature_min, temperature_max, description, humidite)
        VALUES (@ville, @date, @temperature_min, @temperature_max, @description, @humidite)
    `);
    #update     = db.prepare(`
        UPDATE releves
        SET ville = @ville, date = @date, temperature_min = @temperature_min,
            temperature_max = @temperature_max, description = @description, humidite = @humidite
        WHERE id = @id
    `);
    #delete     = db.prepare("DELETE FROM releves WHERE id = ?");

    /**
     * Récupère tous les relevés.
     * @returns {Promise<Object[]>} La liste de tous les relevés, triés par id.
     */
    async findAll() {
        return this.#selectAll.all();
    }

    /**
     * Récupère un relevé par son identifiant.
     * @param {number} id - Identifiant du relevé recherché.
     * @returns {Promise<Object|undefined>} Le relevé correspondant, ou undefined si introuvable.
     */
    async findById(id) {
        return this.#selectById.get(Number(id));
    }

    /**
     * Crée un nouveau relevé (id === null) ou met à jour un relevé existant.
     * @param {import("../models/releve.model.js").Releve} releve - Le relevé à enregistrer.
     * @returns {Promise<Object|null>} Le relevé persisté (avec son id), ou null si l'id à modifier n'existe pas.
     */
    async save(releve) {
        const { id, ville, date, temperature_min, temperature_max, description, humidite } = releve.toJSON();
        const champs = { ville, date, temperature_min, temperature_max, description, humidite };

        if (id === null) {
            const info = this.#insert.run(champs);
            return this.#selectById.get(info.lastInsertRowid);
        }

        const info = this.#update.run({ ...champs, id });
        if (info.changes === 0) return null;
        return this.#selectById.get(id);
    }

    /**
     * Supprime un relevé par son identifiant.
     * @param {number} id - Identifiant du relevé à supprimer.
     * @returns {Promise<boolean>} true si un relevé a été supprimé, false si aucun ne correspondait.
     */
    async deleteById(id) {
        const info = this.#delete.run(Number(id));
        return info.changes > 0;
    }
}

export const relevesRepository = new ReleveRepository();
