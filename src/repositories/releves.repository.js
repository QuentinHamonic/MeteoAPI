import { parseCsv } from "../utils/csv.js";
import {config} from "../config.js"

/**
 * Accès aux données des relevés météo, stockées dans un fichier CSV.
 */
export class ReleveRepository {
    /**
     * @param {string} cheminCsv - Chemin absolu vers le fichier CSV des relevés.
     */
    constructor(cheminCsv){
        this.cheminCsv = cheminCsv;
        console.log(cheminCsv)
    }

    /**
     * Récupère tous les relevés présents dans le CSV.
     * @returns {Promise<Object[]>} La liste de tous les relevés.
     */
    async findAll(){
        return parseCsv(this.cheminCsv)
    }

    /**
     * Récupère un relevé par son identifiant.
     * @param {number} id - Identifiant du relevé recherché.
     * @returns {Promise<Object|undefined>} Le relevé correspondant, ou undefined si introuvable.
     */
    async findById(id){
        const csv = parseCsv(this.cheminCsv)
        return csv[id]
    }

    /**
     * Enregistre un nouveau relevé.
     * @param {import("../models/releve.model.js").Releve} releve - Le relevé à enregistrer.
     * @returns {Promise<number>} L'identifiant attribué au relevé.
     */
    async save(releve){
        // A FAIRE DEFI
        return 0
    }

}

export const relevesRepository = new ReleveRepository(config.cheminCsv);
