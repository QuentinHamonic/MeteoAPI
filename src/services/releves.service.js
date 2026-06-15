import { relevesRepository } from "../repositories/releves.repository.js";

export class ReleveService {
    constructor(repository) {
        this.repository = repository; // dépendance injectée, pas créée ici
    }
    async getTousLesReleves() {
        const releves = await this.repository.findAll();
        // ici viendra le métier : tri, filtres, calculs .
        return releves;
    }
}
// on câble le service avec le repository, et on exporte l'instance prête
export const releveService = new ReleveService(relevesRepository);
