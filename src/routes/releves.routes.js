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
 * /releves:
 *   post:
 *     summary: Crée un nouveau relevé
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ville, date, temperature_min, temperature_max, description, humidite]
 *             properties:
 *               ville:
 *                 type: string
 *                 example: Paris
 *               date:
 *                 type: string
 *                 example: "2024-02-01"
 *               temperature_min:
 *                 type: number
 *                 example: -1
 *               temperature_max:
 *                 type: number
 *                 example: 4
 *               description:
 *                 type: string
 *                 example: Nuageux
 *               humidite:
 *                 type: number
 *                 example: 85
 *     responses:
 *       201:
 *         description: Relevé créé avec son id attribué
 *       400:
 *         description: Données invalides (liste des erreurs)
 */
router.post("/", controller.creerReleve);

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

/**
 * @openapi
 * /releves/{id}:
 *   put:
 *     summary: Remplace un relevé existant (tous les champs requis)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ville, date, temperature_min, temperature_max, description, humidite]
 *             properties:
 *               ville:
 *                 type: string
 *               date:
 *                 type: string
 *               temperature_min:
 *                 type: number
 *               temperature_max:
 *                 type: number
 *               description:
 *                 type: string
 *               humidite:
 *                 type: number
 *     responses:
 *       200:
 *         description: Relevé mis à jour
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Relevé introuvable
 */
router.put("/:id", controller.modifierReleve);
 
/**
 * @openapi
 * /releves/{id}:
 *   delete:
 *     summary: Supprime un relevé
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Relevé supprimé (aucun contenu)
 *       404:
 *         description: Relevé introuvable
 */
router.delete("/:id", controller.supprimerReleve);

export default router;
