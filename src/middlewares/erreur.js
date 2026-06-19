/**
 * Middleware de gestion d'erreurs centralisé (4 paramètres = Express le reconnaît comme tel).
 * Express 5 route automatiquement ici toute erreur levée ou rejetée dans un handler async.
 * @param {Error & {status?: number}} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export function gestionErreurs(err, req, res, next) {
    console.error(err);
    const status = err.status ?? 500;
    // Les erreurs sans status explicite sont inattendues (bug, fichier manquant, etc.) :
    // on ne renvoie pas err.message au client pour éviter de leaker des détails internes (chemins, stack...).
    const erreur = err.status ? (err.message ?? "Erreur serveur") : "Erreur interne du serveur";
    res.status(status).json({ erreur });
}