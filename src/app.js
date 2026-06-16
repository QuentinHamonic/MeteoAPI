import express from "express";
import relevesRoutes from "./routes/releves.routes.js";
import villesRoutes from "./routes/villes.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const spec = swaggerJsdoc({
definition: { openapi: "3.0.0", info: { title: "MétéoAPI", version: "1.0.0" } },
apis: ["./src/routes/*.js"], // fichiers où chercher les annotations
});
const app = express();

app.use(express.json());

app.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
app.use("/releves", relevesRoutes);
app.use("/villes", villesRoutes)

export default app;
