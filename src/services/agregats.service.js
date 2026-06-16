import { relevesRepository } from "../repositories/releves.repository.js";
import { Stats } from "../models/stats.model.js";

export class AgregatService {
    constructor(repository) {
        this.repository = repository; // dépendance injectée, pas créée ici
    }

    /**
     * Récupère tous les relevés météo.
     * @returns {Promise<Object[]>} Objet Stats.
     */
    async getStats() {
        const releves = await this.repository.findAll();
        return Stats.depuisReleves(releves);
    }
}

export const agregatService = new AgregatService(relevesRepository);