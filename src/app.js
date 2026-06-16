import express from "express";
import relevesRoutes from "./routes/releves.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import villesRoutes from "./routes/villes.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import {logger} from "./middlewares/logger.js"
import {gestionErreurs} from "./middlewares/erreur.js"

const spec = swaggerJsdoc({
definition: { openapi: "3.0.0", info: { title: "MétéoAPI", version: "1.0.0" } },
apis: ["./src/routes/*.js"], // fichiers où chercher les annotations
});
const app = express();

app.use(express.json());
app.use(logger)
app.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

app.use("/releves", relevesRoutes);
app.use("/stats", statsRoutes);
app.use("/villes", villesRoutes)

app.use(gestionErreurs);

export default app;
