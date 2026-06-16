import { villeService } from "../services/villes.service.js";

export class VilleController {
    constructor(service) {
        this.service = service; // service injecté
    }
    // fonction fléchée en propriété : garde le bon `this` quand on la passe au router
    listerVilles = async(req, res) => {
        const releves = await this.service.getToutesLesVilles();
        res.json(releves);
    };

    getRelevesParVille = async (req, res) => {
        const releves = await this.service.getRelevesParVille(req.params.ville);
        if(releves.length === 0){
            return res.status(404).json({erreur : `Relevé(s) de la ville ${req.params.ville} introuvable(s)`});
        }
        res.json(releves)
    } 

}

export const villeController = new VilleController(villeService);
