import { statsService } from "../services/stats.service.js";
 
/**
 * Pont HTTP pour la ressource stats.
 * Un seul endpoint : GET /stats renvoie un objet unique (pas une liste).
 */
export class StatsController {
    constructor(service) {
        this.service = service;
    }
 
    /**
     * GET /stats — retourne les statistiques globales.
     */
    getStats = async (req, res) => {
        const stats = await this.service.getStats();
        res.json(stats);
    };
}
 
export const statsController = new StatsController(statsService);