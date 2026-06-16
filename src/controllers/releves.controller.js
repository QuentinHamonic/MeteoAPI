import { releveService } from "../services/releves.service.js";

export class ReleveController {
    constructor(service) {
        this.service = service; // service injecté
    }
    
    // fonction fléchée en propriété : garde le bon `this` quand on la passe au router
    listerReleves = async(req, res) => {
        const releves = await this.service.getTousLesReleves();
        res.json(releves);
    };

    // à venir : getUnReleve = async (req, res) > { . 404 si introuvable }
    getUnReleve = async (req, res) => {
        const releve = await this.service.getReleveParId(req.params.id);
        if(releve === undefined){
            return res.status(404).json({erreur : `Relevé ${req.params.id} introuvable`});
        }
        res.json(releve)
    }

    /**
     * POST /releves
     *
     * Le client envoie un JSON dans req.body (sans id).
     * Le service valide et persiste.
     */
    creerReleve = async (req, res) => {
        const { releve, erreurs } = await this.service.creerReleve(req.body);
 
        if (erreurs) return res.status(400).json({ erreurs });
 
        res.status(201).json(releve);
    };

    /**
     * PUT /releves/:id
     *
     * Le client envoie le relevé entier (sauf l'id, qui vient de l'URL).
     */
    modifierReleve = async (req, res) => {
        const { releve, erreurs, introuvable } = await this.service.modifierReleve(req.params.id, req.body);
 
        if (introuvable) return res.status(404).json({ erreur: `Relevé ${req.params.id} introuvable` });
        if (erreurs) return res.status(400).json({ erreurs });
 
        res.json(releve);
    };
 
    /**
     * DELETE /releves/:id
     *
     * Supprime le relevé.
     */
    supprimerReleve = async (req, res) => {
        const supprime = await this.service.supprimerReleve(req.params.id);
 
        if (!supprime) return res.status(404).json({ erreur: `Relevé ${req.params.id} introuvable` });
 
        res.status(204).send();
    };
}

export const releveController = new ReleveController(releveService);
