/**
 * Vérifie qu'une chaîne "YYYY-MM-DD" correspond à une date réelle du calendrier.
 * Rejette les dates au bon format mais inexistantes (ex : 2024-02-30, 2024-13-01, 2023-02-29).
 * @param {string} s - Chaîne déjà validée au format YYYY-MM-DD.
 * @returns {boolean} true si la date existe réellement.
 */
function estDateCalendaireValide(s) {
    const [annee, mois, jour] = s.split('-').map(Number);
    const d = new Date(annee, mois - 1, jour);
    // Si un champ a "débordé" (ex : 30 février → 1er mars), les composants ne correspondent plus.
    return d.getFullYear() === annee && d.getMonth() === mois - 1 && d.getDate() === jour;
}

/**
 * Représente un relevé météo pour une ville et une date données.
 */
export class Releve {
    #id
    #ville
    #date
    #temperature_min
    #temperature_max
    #description
    #humidite

    /**
     * @param {Object} donnees
     * @param {number|null} [donnees.id] - Identifiant du relevé (null si pas encore persisté).
     * @param {string} donnees.ville - Nom de la ville.
     * @param {string} donnees.date - Date du relevé (format YYYY-MM-DD).
     * @param {number} donnees.temperature_min - Température minimale relevée (°C).
     * @param {number} donnees.temperature_max - Température maximale relevée (°C).
     * @param {string} donnees.description - Description du temps (ex : "Neige légère").
     * @param {number} donnees.humidite - Taux d'humidité relevé (%).
     */
    constructor(donnees) {

        this.#id = donnees.id ?? null
        this.#ville = donnees.ville
        this.#date = donnees.date
        this.#temperature_min = donnees.temperature_min
        this.#temperature_max = donnees.temperature_max
        this.#description = donnees.description
        this.#humidite = donnees.humidite
    }

    get id(){
        return this.#id;
    }
    set id(x){
        this.#id = x;
    }

    get ville(){
        return this.#ville;
    }
    set ville(x){
        this.#ville = x;
    }

    get date(){
        return this.#date;
    }
    set date(x){
        this.#date = x;
    }

    get temperature_min(){
        return this.#temperature_min;
    }
    set temperature_min(x){
        this.#temperature_min = x;
    }

    get temperature_max(){
        return this.#temperature_max;
    }
    set temperature_max(x){
        this.#temperature_max = x;
    }

    get description(){
        return this.#description;
    }
    set description(x){
        this.#description = x;
    }

    get humidite(){
        return this.#humidite;
    }
    set humidite(x){
        this.#humidite = x;
    }






    /**
     * Vérifie que le relevé respecte les règles métier attendues.
     * @returns {string[]} La liste des messages d'erreur ; tableau vide si le relevé est valide.
     */
    valider(){
        const tableau = [];

        if (typeof this.#ville !== 'string' || this.#ville.trim() === '') {
            tableau.push('ville doit être une chaîne non vide');
        }

        const formatDate = /^\d{4}-\d{2}-\d{2}$/;
        if (typeof this.#date !== 'string' || !formatDate.test(this.#date)) {
            tableau.push('date doit être une chaîne au format YYYY-MM-DD');
        } else if (!estDateCalendaireValide(this.#date)) {
            tableau.push('date doit être une date réelle du calendrier (ex : 2024-02-30 est invalide)');
        }

        if (this.#temperature_min === undefined) {
            tableau.push('temperature_min non déclarée');
        } else if (isNaN(this.#temperature_min)) {
            tableau.push('temperature_min doit être un nombre');
        }

        if (this.#temperature_max === undefined) {
            tableau.push('temperature_max non déclarée');
        } else if (isNaN(this.#temperature_max)) {
            tableau.push('temperature_max doit être un nombre');
        }

        if (!isNaN(this.#temperature_min) && !isNaN(this.#temperature_max) && this.#temperature_max <= this.#temperature_min) {
            tableau.push('temperature_max doit être supérieure à temperature_min');
        }

        if (typeof this.#description !== 'string' || this.#description.trim() === '') {
            tableau.push('description doit être une chaîne non vide');
        }

        if (this.#humidite === undefined) {
            tableau.push('humidite non déclarée');
        } else if (isNaN(this.#humidite) || this.#humidite < 0 || this.#humidite > 100) {
            tableau.push('humidite doit être un nombre entre 0 et 100');
        }

        return tableau
    }

    /**
     * Sérialise le relevé sous forme d'objet brut (appelé automatiquement par JSON.stringify / res.json()).
     * @returns {Object} Représentation brute du relevé (id, ville, date, températures, description, humidité).
     */
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

    /**
     * Construit un Releve à partir d'une ligne brute du fichier CSV (sans la ligne d'en-tête).
     * Le CSV ne contient pas d'id : il vaut null jusqu'à son attribution par le repository.
     * @param {string} ligne - Une ligne du CSV, ex : "Paris;2024-01-15;-1;1;Neige légère;91".
     * @returns {Releve} Le relevé correspondant à la ligne.
     */
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