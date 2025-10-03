import { Router } from "express";
import {
  changeUserStatus,
  createUser,
  getActiveUsers,
  getAllActiveUsers,
  getInactiveUsers,
  getUser,
  getUserById,
  transferAdminRole,
  updateUser,
} from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", verifyToken, createUser);
router.get("/active", verifyToken, getActiveUsers);
router.get("/all_active", getAllActiveUsers);
router.get("/inactive", verifyToken, getInactiveUsers);
router.post("/transfer_admin_role", verifyToken, transferAdminRole);
router.get("/:id", getUserById);
router.get("/:email", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.post("/set_status/:id", verifyToken, changeUserStatus);

export default router;
