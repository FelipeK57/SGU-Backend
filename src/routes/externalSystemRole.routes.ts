import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { createRole, getRoles } from "../controllers/externalSystemRole.controller";

const router = Router();

router.post("/", verifyToken, createRole);
router.get("/:externalSystemId", verifyToken, getRoles)

export default router;
