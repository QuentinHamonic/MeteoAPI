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
// router.get("/:id", controller.getUnReleve);

export default router;
