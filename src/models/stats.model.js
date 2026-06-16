/**
 * Représente les statistiques globales calculées sur l'ensemble des relevés.
 */
export class Stats {
    #temperatureMinAbsolue
    #temperatureMaxAbsolue
    #temperatureMoyenne
    #humiditeMoyenne
    #nombreTotalReleves
    #nombreVilles
    #villesPlusHumides    // top 3 villes par humidité moyenne
    #villesPlusChaudes    // top 3 villes par température moyenne ((min + max) / 2)
 
    /**
     * @param {Object} donnees
     * @param {number} donnees.temperatureMinAbsolue - Température minimale toutes villes confondues.
     * @param {number} donnees.temperatureMaxAbsolue - Température maximale toutes villes confondues.
     * @param {number} donnees.temperatureMoyenne - Moyenne globale de (temp_min + temp_max) / 2.
     * @param {number} donnees.humiditeMoyenne - Moyenne globale de l'humidité.
     * @param {number} donnees.nombreTotalReleves - Nombre total de relevés dans le CSV.
     * @param {number} donnees.nombreVilles - Nombre de villes distinctes.
     * @param {string[]} donnees.villesPlusHumides - Top 3 des villes les plus humides.
     * @param {string[]} donnees.villesPlusChaudes - Top 3 des villes les plus chaudes.
     */
    constructor(donnees) {
        this.#temperatureMinAbsolue = donnees.temperatureMinAbsolue;
        this.#temperatureMaxAbsolue = donnees.temperatureMaxAbsolue;
        this.#temperatureMoyenne = donnees.temperatureMoyenne;
        this.#humiditeMoyenne = donnees.humiditeMoyenne;
        this.#nombreTotalReleves = donnees.nombreTotalReleves;
        this.#nombreVilles = donnees.nombreVilles;
        this.#villesPlusHumides = donnees.villesPlusHumides;
        this.#villesPlusChaudes = donnees.villesPlusChaudes;
    }
 
    /**
     * Sérialise les stats sous forme d'objet brut.
     * @returns {Object}
     */
    toJSON() {
        return {
            temperatureMinAbsolue: this.#temperatureMinAbsolue,
            temperatureMaxAbsolue: this.#temperatureMaxAbsolue,
            temperatureMoyenne: this.#temperatureMoyenne,
            humiditeMoyenne: this.#humiditeMoyenne,
            nombreTotalReleves: this.#nombreTotalReleves,
            nombreVilles: this.#nombreVilles,
            villesPlusHumides: this.#villesPlusHumides,
            villesPlusChaudes: this.#villesPlusChaudes
        };
    }
 
    /**
     * Construit un objet Stats à partir de l'ensemble des relevés bruts.
     *
     * Tout le calcul est ici, dans le model — le service n'a qu'à appeler
     * Stats.depuisReleves(releves) et récupérer un objet prêt à renvoyer.
     *
     * @param {Object[]} releves - Tableau de TOUS les relevés.
     * @returns {Stats}
     */
    static depuisReleves(releves) {
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
        const agregatsParVille = [...parVille.entries()].map(([ville, rs]) => ({
            ville,
            humidite:    rs.reduce((acc, r) => acc + r.humidite, 0) / rs.length,
            temperature: rs.reduce((acc, r) => acc + (r.temperature_min + r.temperature_max) / 2, 0) / rs.length
        }));
 
        const triParHumiditeDesc = [...agregatsParVille].sort((a, b) => b.humidite - a.humidite);
        const triParTemp         = [...agregatsParVille].sort((a, b) => b.temperature - a.temperature);
 
        return new Stats({
            temperatureMinAbsolue,
            temperatureMaxAbsolue,
            temperatureMoyenne,
            humiditeMoyenne,
            nombreTotalReleves: n,
            nombreVilles: parVille.size,
            villesPlusHumides: triParHumiditeDesc.slice(0, 3).map(v => v.ville),
            villesPlusChaudes: triParTemp.slice(0, 3).map(v => v.ville)
        });
    }
}