import { Router } from "express";
import { createUser } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", verifyToken, createUser);

export default router;
