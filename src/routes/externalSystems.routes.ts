import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import {
  createExternalSystem,
  getExternalSystems,
} from "../controllers/externalSystem.controller";

const router = Router();

router.post("/", verifyToken, createExternalSystem);
router.get("/", verifyToken, getExternalSystems);

export default router;
