import { Releve } from '../models/releve.model.js';

// --- depuisLigneCsv ---
const releve = Releve.depuisLigneCsv('Paris;2024-01-15;-1;1;Neige légère;91');
console.assert(releve.toJSON().ville === 'Paris', 'ville doit être Paris');
console.assert(releve.toJSON().temperature_min === -1, 'temp_min doit être -1');
console.assert(releve.toJSON().id === null, 'id doit être null par défaut');
console.log('depuisLigneCsv ✅');

// --- valider() cas valide ---
const erreurs = releve.valider();
console.assert(erreurs.length === 0, 'relevé valide ne doit pas avoir d\'erreurs');
console.log('valider() cas valide ✅');

// --- valider() cas invalide ---
const releveInvalide = new Releve({ ville: '', date: '', temperature_min: 'abc', temperature_max: 5, description: '', humidite: 200 });
const erreursInvalide = releveInvalide.valider();
console.assert(erreursInvalide.length > 0, 'doit avoir des erreurs');
console.log('valider() cas invalide ✅', erreursInvalide);