import { Router } from "express";
import {
  login,
  resetPassword,
  sendCodeEmail,
  validateCode,
  validateCurrentPassword,
} from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", login);
router.post("/send_reset_code", sendCodeEmail);
router.post("/validate_reset_code", validateCode);
router.post("/reset_password", resetPassword);
router.post("/validate_current_password", verifyToken, validateCurrentPassword);

export default router;
