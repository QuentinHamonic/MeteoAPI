import express from "express";
import relevesRoutes from "./routes/releves.routes.js";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.get('/releves', relevesRoutes);

app.listen(PORT, () => {
  console.log(`Restaurant Admin → http://localhost:${PORT}`);
});