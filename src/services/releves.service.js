import { relevesRepository } from "../repositories/releves.repository.js";

/**
 * Logique métier autour des relevés météo.
 */
export class ReleveService {
    /**
     * @param {import("../repositories/releves.repository.js").ReleveRepository} repository - Repository injecté pour l'accès aux données.
     */
    constructor(repository) {
        this.repository = repository; // dépendance injectée, pas créée ici
    }

    /**
     * Récupère tous les relevés météo.
     * @returns {Promise<Object[]>} La liste de tous les relevés.
     */
    async getTousLesReleves() {
        const releves = await this.repository.findAll();
        // ici viendra le métier : tri, filtres, calculs .
        return releves;
    }
}
// on câble le service avec le repository, et on exporte l'instance prête
export const releveService = new ReleveService(relevesRepository);
