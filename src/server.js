import express from "express";
import {parseCsv} from "./utils/csv.js"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.get('/releves', async (req, res) => {
    const tableau = await parseCsv();

    res.status(200).json(tableau);
});

app.listen(PORT, () => {
  console.log(`Restaurant Admin → http://localhost:${PORT}`);
});