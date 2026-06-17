import { relevesRepository } from "../repositories/releves.repository.js";
import { Releve } from "../models/releve.model.js";

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

    /**
     * Récupère un relevé par son identifiant.
     * @param {string|number} id - Identifiant du relevé (converti en entier).
     * @returns {Promise<Object|undefined>} Le relevé correspondant, ou undefined si l'id est invalide ou introuvable.
     */
    async getReleveParId(id) {
        const id_number = parseInt(id);
        if (isNaN(id)) {
            return undefined
        } else {
            return this.repository.findById(id_number)
        }
    }

    /**
     * Crée un nouveau relevé après validation.
     *
     * @param {Object} donnees - Corps de la requête (req.body).
     * @returns {Promise<{releve?: Object, erreurs?: string[]}>}
     */
    async creerReleve(donnees) {
        const releve = new Releve({
            id: null,
            ville: donnees.ville,
            date: donnees.date,
            temperature_min: Number(donnees.temperature_min),
            temperature_max: Number(donnees.temperature_max),
            description: donnees.description,
            humidite: Number(donnees.humidite)
        });
 
        const erreurs = releve.valider();
        if (erreurs.length > 0) return { erreurs };
 
        const sauvegarde = await this.repository.save(releve);
        return { releve: sauvegarde };
    }
 
    /**
     * Met à jour un relevé existant après validation.
     *
     * @param {string|number} id
     * @param {Object} donnees - Corps de la requête (req.body).
     * @returns {Promise<{releve?: Object, erreurs?: string[], introuvable?: boolean}>}
     */
    async modifierReleve(id, donnees) {
        const id_number = Number(id);
        if (isNaN(id_number)) return { introuvable: true };
 
        const existant = await this.repository.findById(id_number);
        if (!existant) return { introuvable: true };
 
        const releve = new Releve({
            id: id_number,           // on garde l'id existant
            ville: donnees.ville,
            date: donnees.date,
            temperature_min: Number(donnees.temperature_min),
            temperature_max: Number(donnees.temperature_max),
            description: donnees.description,
            humidite: Number(donnees.humidite)
        });
 
        const erreurs = releve.valider();
        if (erreurs.length > 0) return { erreurs };
 
        const sauvegarde = await this.repository.save(releve);
        return { releve: sauvegarde };
    }
 
    /**
     * Supprime un relevé par son identifiant.
     *
     * @param {string|number} id
     * @returns {Promise<boolean>} true si supprimé, false si introuvable.
     */
    async supprimerReleve(id) {
        const id_number = Number(id);
        if (isNaN(id_number)) return false;
        return this.repository.deleteById(id_number);
    }
}

// on câble le service avec le repository, et on exporte l'instance prête
export const releveService = new ReleveService(relevesRepository);
