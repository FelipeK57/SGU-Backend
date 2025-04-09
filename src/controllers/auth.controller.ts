import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/users.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Faltan datos" });
    return;
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    return;
  }

  if (!user.active) {
    res.status(401).json({ message: "Usuario inactivo" });
    return;
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  res.status(200).json({
    message: "Login exitoso",
    token,
    user: {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      documentType: user.documentType,
      documentNumber: user.documentNumber,
      role: user.role,
      email: user.email,
      active: user.active,
    },
  });

  return;
};
