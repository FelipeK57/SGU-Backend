import { Router } from "express";
import {
  createWorkArea,
  deleteWorkArea,
  getWorkAreas,
  updateWorkArea,
} from "../controllers/workArea.controller";

const router = Router();

router.post("/", createWorkArea);
router.get("/", getWorkAreas);
router.put("/:id", updateWorkArea);
router.delete("/:id", deleteWorkArea);

export default router;
