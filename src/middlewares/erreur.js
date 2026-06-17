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
    res.status(err.status ?? 500).json({ erreur: err.message ?? "Erreur serveur" });
}