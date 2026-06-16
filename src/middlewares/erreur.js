// middlewares/erreur.js
export function gestionErreurs(err, req, res, next) {
    console.error(err);
    res.status(err.status ?? 500).json({ erreur: err.message ?? "Erreur serveur" });
}