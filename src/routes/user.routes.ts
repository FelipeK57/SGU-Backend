import { Router } from "express";
import {
  changeUserStatus,
  createUser,
  getActiveUsers,
  getInactiveUsers,
  updateUser,
} from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", verifyToken, createUser);
router.get("/active", verifyToken, getActiveUsers);
router.get("/inactive", verifyToken, getInactiveUsers);
router.put("/:id", verifyToken, updateUser);
router.post("/set_status/:id", verifyToken, changeUserStatus);
export default router;
