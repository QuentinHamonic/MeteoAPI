import { relevesRepository } from "../repositories/releves.repository.js";

/**
 * Logique métier autour des statistiques globales — dérive ses données depuis le repository des relevés.
 */
export class StatsService {
    /**
     * @param {import("../repositories/releves.repository.js").ReleveRepository} repository - Repository injecté pour l'accès aux relevés.
     */
    constructor(repository) {
        this.repository = repository; // dépendance injectée, pas créée ici
    }

    /**
     * Calcule et retourne les statistiques globales sur l'ensemble des relevés.
     * @returns {Promise<{temperatureMinAbsolue: number, temperatureMaxAbsolue: number, temperatureMoyenne: number, humiditeMoyenne: number, nombreTotalReleves: number, nombreVilles: number, villesPlusHumides: string[], villesPlusChaudes: string[]}>}
     */
    async getStats() {
        const releves = await this.repository.findAll();
        return this.#calculerStats(releves);
    }

    /**
     * Calcule les statistiques globales à partir d'un tableau de relevés.
     *
     * @param {Object[]} releves - Tableau de TOUS les relevés.
     * @returns {Object} Les statistiques calculées (températures, humidité, classements par ville).
     */
    #calculerStats(releves) {
        const n = releves.length;
 
        const temperatureMinAbsolue = Math.min(...releves.map(r => r.temperature_min));
        const temperatureMaxAbsolue = Math.max(...releves.map(r => r.temperature_max));
 
        // Température moyenne globale : moyenne de (min + max) / 2 sur tous les relevés.
        // Cohérent avec le classement villesPlusChaudes qui utilise la même formule.
        const temperatureMoyenne = Math.round(
            (releves.reduce((acc, r) => acc + (r.temperature_min + r.temperature_max) / 2, 0) / n) * 10
        ) / 10;
 
        const humiditeMoyenne = Math.round(
            (releves.reduce((acc, r) => acc + r.humidite, 0) / n) * 10
        ) / 10;
 
        // On groupe les relevés par ville dans un Map pour tous les classements.
        // Map { "Paris" => [r1, r2, ...], "Lyon" => [...], ... }
        const parVille = new Map();
        for (const r of releves) {
            if (!parVille.has(r.ville)) parVille.set(r.ville, []);
            parVille.get(r.ville).push(r);
        }
 
        // Pour chaque ville, on calcule humidité moyenne ET température moyenne
        // en un seul passage — même formule (min+max)/2 que temperatureMoyenne globale.
        const statsParVille = [...parVille.entries()].map(([ville, rs]) => ({
            ville,
            humidite:    rs.reduce((acc, r) => acc + r.humidite, 0) / rs.length,
            temperature: rs.reduce((acc, r) => acc + (r.temperature_min + r.temperature_max) / 2, 0) / rs.length
        }));
 
        const triParHumiditeDesc = [...statsParVille].sort((a, b) => b.humidite - a.humidite);
        const triParTemp         = [...statsParVille].sort((a, b) => b.temperature - a.temperature);
 
        return {
            temperatureMinAbsolue,
            temperatureMaxAbsolue,
            temperatureMoyenne,
            humiditeMoyenne,
            nombreTotalReleves: n,
            nombreVilles: parVille.size,
            villesPlusHumides: triParHumiditeDesc.slice(0, 3).map(v => v.ville),
            villesPlusChaudes: triParTemp.slice(0, 3).map(v => v.ville)
        };
    }
}

export const statsService = new StatsService(relevesRepository);