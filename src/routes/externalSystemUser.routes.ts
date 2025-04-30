import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { updateRole } from "../controllers/externalSystemUser.controller";

const router = Router();

router.post("/", verifyToken, updateRole);

export default router;
