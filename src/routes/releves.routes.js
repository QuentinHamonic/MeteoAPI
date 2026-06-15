import { Router } from "express";
import { releveController as controller } from "../controllers/releves.controller.js";

const router = Router();
router.get("/", controller.listerReleves);
router.get("/releves", controller.listerReleves);
// router.get("/:id", controller.getUnReleve);

export default router;
