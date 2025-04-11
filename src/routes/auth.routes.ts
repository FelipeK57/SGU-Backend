import { Router } from "express";
import { login, sendCodeEmail } from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);
router.post("/send_reset_code", sendCodeEmail);

export default router;
