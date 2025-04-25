import { Router } from "express";
import {
  changeUserStatus,
  createUser,
  getActiveUsers,
  getInactiveUsers,
  getUser,
  transferAdminRole,
  updateUser,
} from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", verifyToken, createUser);
router.get("/active", verifyToken, getActiveUsers);
router.get("/inactive", verifyToken, getInactiveUsers);
router.post("/transfer_admin_role", verifyToken, transferAdminRole);
router.get("/:email", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.post("/set_status/:id", verifyToken, changeUserStatus);

export default router;
