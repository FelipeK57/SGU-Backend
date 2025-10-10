import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import {
  createExternalSystem,
  deleteExternalSystem,
  getExternalSystems,
  getExternalSystemUsers,
  updateExternalSystem,
} from "../controllers/externalSystem.controller";

const router = Router();

router.post("/", verifyToken, createExternalSystem);
router.get("/", verifyToken, getExternalSystems);
router.get("/:id/users", verifyToken, getExternalSystemUsers);
router.delete("/:id", verifyToken, deleteExternalSystem);
router.put("/:id", verifyToken, updateExternalSystem);

export default router;
