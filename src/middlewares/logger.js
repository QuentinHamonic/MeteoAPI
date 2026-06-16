export function logger(req, res, next) {
    const debut = Date.now();
    res.on("finish", () => { // quand la réponse est partie.
        const duree = Date.now() - debut;
        console.log(`${req.method} ${req.originalUrl} > ${res.statusCode} (${duree} ms)`);
    });
    next(); // ⚠ sans next(), la requête reste bloquée
}