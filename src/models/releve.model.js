export class Releve {

    #id
    #ville
    #date
    #temperature_min
    #temperature_max
    #description
    #humidite

    constructor(donnees) {

        this.#id = donnees.id ?? null
        this.#ville = donnees.ville
        this.#date = donnees.date
        this.#temperature_min = donnees.temperature_min
        this.#temperature_max = donnees.temperature_max
        this.#description = donnees.description
        this.#humidite = donnees.humidite
    }

    valider(){
        const tableau = [];
        this.#ville === undefined ? tableau.push('ville non déclarée') : '';
        this.#date === undefined ? tableau.push('date non déclarée') : '';

        this.#temperature_min === undefined ? tableau.push('temperature_min non déclarée') : '';
        isNaN(this.#temperature_min) ? tableau.push("temperature_min doit être un nombre") : '';
        this.#temperature_max === undefined ? tableau.push('temperature_max non déclarée') :'' ;
        isNaN(this.#temperature_max) ? tableau.push("temperature_max doit être un nombre") :'' ;

        this.#temperature_max > this.#temperature_min ? '' : tableau.push('temperature_max doit être supérieure à temperature_min');

        this.#description === undefined ? tableau.push('description non déclarée') : '';
        this.#humidite === undefined ? tableau.push('humidite non déclarée') : '';
        isNaN(this.#humidite) ? tableau.push("humidite doit être un nombre") :'' ;

        return tableau
    }

    toJSON(){

        return {
            id: this.#id,
            ville: this.#ville,
            date: this.#date,
            temperature_min: this.#temperature_min,
            temperature_max: this.#temperature_max,
            description: this.#description,
            humidite: this.#humidite
        }
    }

    static depuisLigneCsv(ligne){
        const label = ['ville', 'date', 'temperature_min', 'temperature_max', 
            'description', 'humidite']
        const separateur = ligne.includes(';') ? ';' : ',';
        const colonnes = [];
        let valeur = '';

        for (let i = 0; i < ligne.length; i++) {
            const caractere = ligne[i];
            if (caractere === separateur) {
                colonnes.push(valeur);
                valeur = '';
            } else {
                valeur += caractere;
            }
        }
        colonnes.push(valeur);
        const mapped = Object.fromEntries(label.map((id, index) => [id, colonnes[index]]));
        mapped.temperature_min = Number(mapped.temperature_min);
        mapped.temperature_max = Number(mapped.temperature_max);
        mapped.humidite = Number(mapped.humidite);

        return new Releve(mapped);
    }

}