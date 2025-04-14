import { Router } from "express";
import {
  login,
  resetPassword,
  sendCodeEmail,
  validateCode,
} from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);
router.post("/send_reset_code", sendCodeEmail);
router.post("/validate_reset_code", validateCode);
router.post("/reset_password", resetPassword);

export default router;
