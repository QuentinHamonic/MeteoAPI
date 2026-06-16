import { parseCsv, writeCsv } from "../utils/csv.js";
import { config } from "../config.js"

/**
 * Accès aux données des relevés météo, stockées dans un fichier CSV.
 */
export class ReleveRepository {
    /**
     * @param {string} cheminCsv - Chemin absolu vers le fichier CSV des relevés.
     */
    constructor(cheminCsv) {
        this.releves = null
        this.cheminCsv = cheminCsv;
        console.log(cheminCsv)
    }

    /**
     * Récupère tous les relevés présents dans le CSV.
     * @returns {Promise<Object[]>} La liste de tous les relevés.
     */
    async findAll() {
        if (this.releves === null) {
            const parse = await parseCsv(this.cheminCsv)
            this.releves = parse
            return parse
        }
        else {
            return this.releves
        }
    }

    /**
     * Récupère un relevé par son identifiant.
     * @param {number} id - Identifiant du relevé recherché.
     * @returns {Promise<Object|undefined>} Le relevé correspondant, ou undefined si introuvable.
     */
    async findById(id) {
        const releves = await this.findAll()
        return releves.find(releve => releve.id === Number(id))
    }

    /**
     * Enregistre un nouveau relevé.
     * @param {import("../models/releve.model.js").Releve} releve - Le relevé à enregistrer.
     * @returns {Promise<number>} L'identifiant attribué au relevé.
     */
    async save(releve) {
        const releves = await this.findAll()
        const max_id = releves.reduce((max, r) => Math.max(max, r.id), 0);

        releves.id = max_id + 1;

        const nouveauReleve = { ...releve.toJSON(), id: max_id + 1 };
        releves.push(nouveauReleve);
        await writeCsv(this.cheminCsv, this.releves);

        return nouveauReleve.id;
    }

    /**
     * Supprime un relevé par son identifiant et persiste le changement dans le CSV.
     * @param {number} id - Identifiant du relevé à supprimer.
     * @returns {Promise<boolean>} true si un relevé a été supprimé, false si aucun ne correspondait.
     */
    async deleteById(id) {
        const releves = await this.findAll()
        const index = releves.findIndex(releve => releve.id === Number(id))

        if (index === -1) {
            return false
        }

        releves.splice(index, 1)
        await writeCsv(this.cheminCsv, this.releves)
        return true
    }
}

export const relevesRepository = new ReleveRepository(config.cheminCsv);
