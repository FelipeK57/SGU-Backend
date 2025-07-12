import Router from "express";
import { loginExternalSystem } from "../controllers/authExternalSystem.controller";

const router = Router();

router.post("/login", loginExternalSystem);

export default router;
