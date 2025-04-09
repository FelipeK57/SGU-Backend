import User from "../models/users.model";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

export const createUser = async (req: Request, res: Response) => {
  const {
    name,
    lastName,
    documentType,
    documentNumber,
    role,
    email,
    password,
  } = req.body;

  console.log(req.body);

  if (
    !name ||
    !lastName ||
    !documentType ||
    !documentNumber ||
    !role ||
    !email ||
    !password
  ) {
    res.status(400).json({ message: "Faltan datos" });
    return;
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "El usuario ya existe" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      lastName,
      documentType,
      documentNumber,
      role,
      email,
      password: hashedPassword,
      active: true,
    });

    res.status(201).json({
      message: "Usuario creado",
      user: {
        id: newUser.id,
        name: newUser.name,
        lastName: newUser.lastName,
        documentType: newUser.documentType,
        documentNumber: newUser.documentNumber,
        role: newUser.role,
        email: newUser.email,
        active: newUser.active,
      },
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario" });
    return;
  }
};
