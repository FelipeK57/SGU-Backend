import User from "../models/users.model";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { UserResponseDTO } from "../dtos/user.dto";

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
    const existingByEmail = await User.findOne({ where: { email } });
    if (existingByEmail) {
      res.status(400).json({ message: "Ya existe un usuario con este correo" });
      return;
    }

    const existingByDocument = await User.findOne({
      where: {
        documentType,
        documentNumber,
      },
    });
    if (existingByDocument) {
      res
        .status(400)
        .json({ message: "Ya existe un usuario con este documento" });
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

export const getActiveUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      where: { active: true, role: "employee" },
    });
    if (users.length === 0) {
      res.status(404).json({ message: "No hay usuarios activos" });
      return;
    }

    const response: UserResponseDTO[] = users.map((user) =>
      toUserResponseDTO(user)
    );

    res.status(200).json({ message: "Usuarios activos", users: response });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios" });
    return;
  }
};

export const getInactiveUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      where: { active: false, role: "employee" },
    });
    if (users.length === 0) {
      res.status(404).json({ message: "No hay usuarios inactivos" });
      return;
    }

    const response: UserResponseDTO[] = users.map((user) =>
      toUserResponseDTO(user)
    );

    res.status(200).json({ message: "Usuarios inactivos", users: response });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios" });
    return;
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, lastName, documentType, documentNumber, email } = req.body;
  console.log(req.body);
  if (!name || !lastName || !documentType || !documentNumber) {
    res.status(400).json({ message: "Faltan datos" });
    return;
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    await User.update(
      { name, lastName, documentType, documentNumber, email },
      { where: { id } }
    );

    res.status(200).json({ message: "Usuario actualizado" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};

export const changeUserStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { active } = req.body;
  if (active === undefined) {
    res.status(400).json({ message: "Faltan datos" });
    return;
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    await User.update({ active }, { where: { id } });

    res.status(200).json({ message: "Estado del usuario actualizado" });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar el estado del usuario" });
    return;
  }
};

// This function converts a User model instance to a UserResponseDTO
const toUserResponseDTO = (user: User): UserResponseDTO => {
  return {
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    documentType: user.documentType,
    documentNumber: user.documentNumber,
    role: user.role,
    email: user.email,
    active: user.active,
  };
};
