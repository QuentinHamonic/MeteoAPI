import { Router } from "express";
import { villeController as controller } from "../controllers/villes.controller.js";

const router = Router();

/**
 * @openapi
 * /villes:
 *   get:
 *     summary: Liste toutes les villes avec leurs agrégats météo
 *     responses:
 *       200:
 *         description: Tableau des villes avec nbReleves, tempMin, tempMax, humidite_moy
 */
router.get("/", controller.listerVilles);
/**
 * @openapi
 * /villes/{ville}:
 *   get:
 *     summary: Récupère tous les relevés d'une ville
 *     parameters:
 *       - in: path
 *         name: ville
 *         required: true
 *         schema:
 *           type: string
 *         description: "Nom de la ville (ex: Paris)"
 *     responses:
 *       200:
 *         description: Liste des relevés pour cette ville
 *       404:
 *         description: Ville introuvable
 */
router.get("/:ville", controller.getRelevesParVille);


export default router;
