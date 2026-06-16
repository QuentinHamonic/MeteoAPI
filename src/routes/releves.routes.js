import { Router } from "express";
import { releveController as controller } from "../controllers/releves.controller.js";

const router = Router();

/**
 * @openapi
 * /releves:
 *   get:
 *     summary: Liste tous les relevés météo
 *     responses:
 *       200:
 *         description: Tableau des relevés
 */
router.get("/", controller.listerReleves);
/**
 * @openapi
 * /releves/{id}:
 *   get:
 *     summary: Récupère un relevé par son identifiant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant numérique du relevé
 *     responses:
 *       200:
 *         description: Le relevé correspondant
 *       404:
 *         description: Relevé introuvable
 */
router.get("/:id", controller.getUnReleve);

export default router;
