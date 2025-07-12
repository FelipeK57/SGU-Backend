import { Router } from "express";
import User from "../models/users.model";
import WorkArea from "../models/workArea.model";
import bcrypt from "bcrypt";

const router = Router();

router.post("/create/admin", async (req, res) => {
  const { name, workAreaName, lastName, documentType, documentNumber, email } =
    req.body;

  const workArea = await WorkArea.findOne({
    where: { name: workAreaName },
  });

  if (!workArea) {
    res.status(400).json({ message: "Work area not found" });
    return;
  }

  const hashedPassword = await bcrypt.hash(documentNumber, 10);

  const user = await User.create({
    name,
    workAreaId: workArea.id,
    lastName,
    documentType,
    documentNumber,
    role: "admin",
    email,
    password: hashedPassword,
    active: true,
  });

  res.status(201).json({ message: "Admin user created successfully", user });
  return;
});

export default router;
