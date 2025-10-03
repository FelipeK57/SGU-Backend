import User from "../models/users.model";
import bcrypt from "bcrypt";
import { Request, response, Response } from "express";
import { UserResponseDTO } from "../dtos/user.dto";
import WorkArea from "../models/workArea.model";
import { Op } from "sequelize";
import ExternalSystem from "../models/externalSystems.model";
import { sequelize } from "../config/db";
import ExternalSystemRole from "../models/externalSystemRole.model";
import ExternalSystemUser from "../models/externalSystemUser.model";

export const getUser = async (req: Request, res: Response) => {
  const { email } = req.params;

  if (!email) {
    res.status(400).json({ message: "Faltan datos" });
    return;
  }
  try {
    const user = (await User.findOne({
      where: { email: email },
      include: [
        {
          model: WorkArea,
          as: "workArea",
          attributes: ["name"],
        },
      ],
    })) as User & { workArea: WorkArea };

    if (!user) {
      res
        .status(404)
        .json({ message: "No se encontro ningun usuario con este correo" });
      return;
    }

    res.status(200).json({
      message: "Usuario encontrado",
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        documentType: user.documentType,
        documentNumber: user.documentNumber,
        workArea: user.workArea.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario " });
    return;
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Faltan datos" });
      return;
    }
    const user = await User.findByPk(id, {
      attributes: ["id", "name", "lastName", "email"],
    });
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario" });
    return;
  }
};

export const createUser = async (req: Request, res: Response) => {
  const {
    name,
    workAreaId,
    lastName,
    documentType,
    documentNumber,
    role,
    email,
    password,
  } = req.body;

  if (
    !name ||
    !workAreaId ||
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

  const transaction = await sequelize.transaction();

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

    const user = await User.create({
      name,
      workAreaId,
      lastName,
      documentType,
      documentNumber,
      role,
      email,
      password: hashedPassword,
      active: true,
    });

    const externalSystems = await ExternalSystem.findAll({ transaction });

    if (externalSystems.length > 0) {
      for (const system of externalSystems) {
        const defaultRole = await ExternalSystemRole.findOne({
          where: { externalSystemId: system.id, name: "Sin rol" },
          transaction,
        });

        await ExternalSystemUser.create(
          {
            userId: user.id,
            externalSystemId: system.id,
            externalRoleId: defaultRole?.id,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    res.status(201).json({
      message: "El usuario se ha creado correctamente",
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        documentType: user.documentType,
        documentNumber: user.documentNumber,
        role: user.role,
        email: user.email,
        active: user.active,
        workArea: user.workAreaId,
      },
    });
    return;
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Error al crear el usuario" });
    return;
  }
};

export const getActiveUsers = async (req: Request, res: Response) => {
  try {
    const users = (await User.findAll({
      where: { active: true, role: "employee" },
      include: [
        {
          model: WorkArea,
          as: "workArea",
          attributes: ["name"],
        },
      ],
    })) as (User & { workArea: WorkArea })[];
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

export const getAllActiveUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      where: { active: true },
      attributes: ["id", "name", "lastName", "email"],
    });
    res.status(200).json({ message: "Usuarios activos", users: users });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios" });
    return;
  }
};

export const getInactiveUsers = async (req: Request, res: Response) => {
  try {
    const users = (await User.findAll({
      where: { active: false, role: "employee" },
      include: [
        {
          model: WorkArea,
          as: "workArea",
          attributes: ["name"],
        },
      ],
    })) as (User & { workArea: WorkArea })[];

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
  const { name, workArea, lastName, documentType, documentNumber, email } =
    req.body;
  if (!name || !workArea || !lastName || !documentType || !documentNumber) {
    res.status(400).json({ message: "Faltan datos" });
    return;
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    const userWithSameDocument = await User.findOne({
      where: {
        documentType,
        documentNumber,
        id: { [Op.ne]: id },
      },
    });

    if (userWithSameDocument) {
      res
        .status(400)
        .json({ message: "Ya existe un usuario con ese documento" });
      return;
    }

    if (email) {
      const userWithSameEmail = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: id },
        },
      });

      if (userWithSameEmail) {
        res.status(400).json({ message: "Ya existe un usuario con ese email" });
        return;
      }
    }

    const existingWorkArea = await WorkArea.findOne({
      where: { name: workArea },
    });
    const workAreaId = existingWorkArea?.id;

    await User.update(
      { name, workAreaId, lastName, documentType, documentNumber, email },
      { where: { id } }
    );

    res.status(200).json({
      message: "Los datos del usuario se han actualizado correctamente",
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario" });
    return;
  }
};

export const transferAdminRole = async (req: Request, res: Response) => {
  const { email, id, password } = req.body;

  const currentAdmin = await User.findOne({ where: { email: email } });

  if (!currentAdmin) {
    res.status(404).json({ message: "Usuario no encontrado" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, currentAdmin.password);

  if (!isPasswordValid) {
    res.status(401).json({
      message: "La contraseña ingresada no es igual a la actual",
    });
    return;
  }

  await User.update({ role: "employee" }, { where: { email: email } });
  await User.update({ role: "admin" }, { where: { id: id } });

  res.status(200).json({
    message: "El rol de administrador ha sido transferido exitosamente",
  });
  return;
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
const toUserResponseDTO = (
  user: User & { workArea?: WorkArea }
): UserResponseDTO => {
  return {
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    documentType: user.documentType,
    documentNumber: user.documentNumber,
    role: user.role,
    email: user.email,
    active: user.active,
    workArea: user.workArea?.name || "",
  };
};
