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
            res.status(404)
        }
        res.json(releve)
    } 
}

export const releveController = new ReleveController(releveService);
