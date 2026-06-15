import { parseCsv } from "../utils/csv.js";
import {config} from "../config.js"

export class ReleveRepository {
    constructor(cheminCsv){
        this.cheminCsv = cheminCsv;
        console.log(cheminCsv)
    }

    async findAll(){
        return parseCsv(this.cheminCsv)
    }

    async findById(id){
        const csv = parseCsv(this.cheminCsv)
        return csv[id]
    }

    async save(releve){
        // A FAIRE DEFI
        return 0
    }

}

export const relevesRepository = new ReleveRepository(config.cheminCsv);
