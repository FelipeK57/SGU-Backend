import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import {
  createRole,
  deleteRole,
  editRole,
  getRoles,
} from "../controllers/externalSystemRole.controller";

const router = Router();

router.post("/", verifyToken, createRole);
router.get("/:id", getRoles);
router.delete("/:id", deleteRole);
router.put("/:id", editRole);

export default router;
