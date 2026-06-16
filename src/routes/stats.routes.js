import { Router } from "express";
import { statsController as controller } from "../controllers/stats.controller.js";
 
const router = Router();
 
/**
 * @openapi
 * /stats:
 *   get:
 *     summary: Retourne les statistiques globales de tous les relevés
 *     responses:
 *       200:
 *         description: Statistiques globales (min/max absolus, moyennes, top villes)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 temperatureMinAbsolue:
 *                   type: number
 *                   example: -5
 *                 temperatureMaxAbsolue:
 *                   type: number
 *                   example: 18
 *                 temperatureMoyenne:
 *                   type: number
 *                   example: 4.3
 *                 humiditeMoyenne:
 *                   type: number
 *                   example: 85.2
 *                 nombreTotalReleves:
 *                   type: integer
 *                   example: 840
 *                 nombreVilles:
 *                   type: integer
 *                   example: 5
 *                 villesPlusHumides:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Lyon", "Paris", "Bordeaux"]
 *                 villesPlusSeches:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Marseille", "Toulouse", "Bordeaux"]
 */
router.get("/", controller.getStats);
 
export default router;