import { Request, Response } from "express";
import ExternalSystemRole from "../models/externalSystemRole.model";
import { Op } from "sequelize";
import ExternalSystemUser from "../models/externalSystemUser.model";

export const createRole = async (req: Request, res: Response) => {
  const { name, externalSystemId } = req.body;

  try {
    const role = await ExternalSystemRole.create({
      name,
      externalSystemId,
    });

    res
      .status(201)
      .json({ message: "El rol del sistema externo se creo correctamente" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const externalSystemRole = await ExternalSystemRole.findByPk(id);

    const externalUsers = await ExternalSystemUser.findAll({
      where: { externalRoleId: id },
    });

    if (externalUsers.length > 0) {
      res.status(400).json({
        message:
          "Este rol no se puede eliminar porqué tiene usuarios asignados",
      });
      return;
    }

    if (externalSystemRole) {
      await externalSystemRole.destroy();
      res
        .status(200)
        .json({ message: "Rol de sistema externo eliminado correctamente" });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
    return;
  }
};

export const editRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    if (!name) {
      res.status(400).json({ message: "Faltan datos" });
      return;
    }

    const existingRole = await ExternalSystemRole.findOne({
      where: {
        name: {
          [Op.iLike]: name,
        },
      },
    });
    if (existingRole) {
      res
        .status(400)
        .json({ message: "Ya existe un área de trabajo con este nombre" });
      return;
    }

    const role = await ExternalSystemRole.findByPk(id);
    if (!role) {
      res.status(404).json({ message: "Área de trabajo no encontrada" });
      return;
    }

    role.name = name;
    await role.save();

    res.status(200).json({
      message: "El rol del sistema externo ha sido actualizado correctamente",
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
    return;
  }
};

export const getRoles = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const externalSystemRoles = await ExternalSystemRole.findAll({
      where: { externalSystemId: id },
    });
    const roles = externalSystemRoles.map((role) => role.dataValues);

    res.status(200).json({ roles });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
    return;
  }
};
