import app from "./app.js";
import {config} from "./config.js"
import { initialiserDb } from "./db.js";

// Filet de sécurité : une exception hors du cycle requête/réponse Express
// (donc non gérée par gestionErreurs) ne doit pas tuer le serveur silencieusement.
process.on("uncaughtException", (err) => {
  console.error("Exception non interceptée :", err);
});
process.on("unhandledRejection", (err) => {
  console.error("Promesse rejetée non gérée :", err);
});

try {
  await initialiserDb();
  app.listen(config.port, () => {
    console.log(`MétéoAPI → http://localhost:${config.port}`);
  });
} catch (err) {
  console.error("Échec du démarrage de l'API :", err.message);
  process.exit(1);
}
