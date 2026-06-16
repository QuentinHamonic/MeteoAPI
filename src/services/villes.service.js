import { relevesRepository } from "../repositories/releves.repository.js";

/**
 * Logique métier autour des villes — dérive ses données depuis le repository des relevés.
 */
export class VilleService {

    /**
     * @param {import("../repositories/releves.repository.js").ReleveRepository} repository - Repository injecté pour l'accès aux relevés.
     */
    constructor(repository) {
        this.repository = repository; // dépendance injectée, pas créée ici
    }

    /**
     * Retourne la liste de toutes les villes distinctes avec leurs agrégats météo.
     * @returns {Promise<{ville: string, nbReleves: number, tempMin: number, tempMax: number, humidite_moy: number}[]>}
     */
    async getToutesLesVilles() {
        const releves = await this.repository.findAll();
        const nomsVilles = [...new Set(releves.map(r => r.ville))];

        return Promise.all(nomsVilles.map(async ville => ({
            ville,
            nbReleves:    (await this.getRelevesParVille(ville)).length,
            tempMin:      await this.temperatureMinimumEnregistree(ville),
            tempMax:      await this.temperatureMaximumEnregistree(ville),
            humidite_moy: Math.round(await this.humiditeMoyenne(ville) * 10)/10,
        })));
    }

    /**
     * Retourne tous les relevés d'une ville donnée.
     * @param {string} ville - Nom de la ville.
     * @returns {Promise<Object[]>} Liste des relevés pour cette ville (vide si aucun).
     */
    async getRelevesParVille(ville) {
        const releves = await this.repository.findAll();
        return releves.filter(r => r.ville.toLowerCase() === ville.toLowerCase());
    }

    /**
     * Retourne la température minimale jamais enregistrée pour une ville.
     * @param {string} ville - Nom de la ville.
     * @returns {Promise<number>}
     */
    async temperatureMinimumEnregistree(ville){
        const releves_par_ville = await this.getRelevesParVille(ville);
        return releves_par_ville.reduce((min, r) => Math.min(min, r.temperature_min), +Infinity);
    }

    /**
     * Retourne la température maximale jamais enregistrée pour une ville.
     * @param {string} ville - Nom de la ville.
     * @returns {Promise<number>}
     */
    async temperatureMaximumEnregistree(ville){
        const releves_par_ville = await this.getRelevesParVille(ville);
        return releves_par_ville.reduce((max, r) => Math.max(max, r.temperature_max), -Infinity);
    }

    /**
     * Retourne la moyenne d'humidité pour une ville.
     * @param {string} ville - Nom de la ville.
     * @returns {Promise<number>}
     */
    async humiditeMoyenne(ville){
        const releves_par_ville = await this.getRelevesParVille(ville);
        return releves_par_ville.reduce((sum, r) => sum + r.humidite, 0) / releves_par_ville.length;
    }

}
// on câble le service avec le repository, et on exporte l'instance prête
export const villeService = new VilleService(relevesRepository);
