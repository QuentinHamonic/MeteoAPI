import express from "express";
import { Router } from 'express';

const app = express();



app.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: "ok" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Restaurant Admin → http://localhost:${PORT}`);
});