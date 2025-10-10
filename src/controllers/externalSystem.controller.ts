import { Request, Response } from "express";
import crypto from "crypto";
import ExternalSystem from "../models/externalSystems.model";
import { ExternalSystemResponseDTO } from "../dtos/externalSystem.dto";
import ExternalSystemUser from "../models/externalSystemUser.model";
import User from "../models/users.model";
import { sequelize } from "../config/db";
import ExternalSystemRole from "../models/externalSystemRole.model";
import WorkArea from "../models/workArea.model";

export const generateUniqueApiKey = async (): Promise<string> => {
  let apiKey: string;

  do {
    apiKey = crypto.randomBytes(24).toString("hex");
  } while (await ExternalSystem.findOne({ where: { key: apiKey } }));

  return apiKey;
};

export const createExternalSystem = async (req: Request, res: Response) => {
  const { name, url } = req.body;

  if (!name || !url) {
    res.status(404).json({ message: "Faltan datos" });
    return;
  }

  const transaction = await sequelize.transaction();
  try {
    const key = await generateUniqueApiKey();

    const externalSystem = await ExternalSystem.create(
      { name, key, url },
      { transaction }
    );

    const users = await User.findAll({
      transaction,
    });

    const defaultRole = await ExternalSystemRole.create(
      {
        name: "Sin rol",
        externalSystemId: externalSystem.id,
      },
      { transaction }
    );

    const externalSystemUsersData = users.map((user) => ({
      userId: user.id,
      externalSystemId: externalSystem.id,
      externalRoleId: defaultRole.id,
    }));

    await ExternalSystemUser.bulkCreate(externalSystemUsersData, {
      transaction,
    });

    await transaction.commit();
    res
      .status(201)
      .json({ message: "El sistema externo se ha creado correctamente" });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: "Error creando el sistema externo" });
  }
};

export const getExternalSystems = async (req: Request, res: Response) => {
  try {
    const externalSystems = await ExternalSystem.findAll();

    if (externalSystems.length === 0) {
      res.status(200).json({ message: "No se encontraron sistemas externos" });
    } else {
      const response: ExternalSystemResponseDTO[] = externalSystems.map(
        (externalSystem) => toExternalSystemResponseDTO(externalSystem)
      );
      res.status(200).json({ externalSystems: response });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getExternalSystemUsers = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const externalSystemUsers = await ExternalSystemUser.findAll({
      where: { externalSystemId: id },
      include: [
        {
          model: ExternalSystem,
          attributes: ["name", "url"],
        },
        {
          model: User,
          attributes: [
            "id",
            "name",
            "workAreaId",
            "lastName",
            "email",
            "documentType",
            "documentNumber",
            "role",
            "active",
          ],
          include: [
            {
              model: WorkArea,
              as: "workArea",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: ExternalSystemRole,
          attributes: ["id", "name"],
        },
      ],
    });

    res.status(200).json({ externalSystemUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

export const deleteExternalSystem = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const externalSystem = await ExternalSystem.findByPk(id);
    if (externalSystem) {
      await externalSystem.destroy();
      res
        .status(200)
        .json({ message: "El sistema externo eliminado correctamente" });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el sistema externo" });
    return;
  }
};

export const updateExternalSystem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, url } = req.body;

  if (!name || !url) {
    res.status(404).json({ message: "Faltan datos" });
    return;
  }

  try {
    const externalSystem = await ExternalSystem.findByPk(id);
    if (externalSystem) {
      externalSystem.name = name;
      externalSystem.url = url;
      await externalSystem.save();
      res
        .status(200)
        .json({
          message: "El sistema externo se ha actualizado correctamente",
        });
      return;
    } else {
      res.status(404).json({ message: "No se encontró el sistema externo" });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Error actualizando el sistema externo" });
    return;
  }
};

const toExternalSystemResponseDTO = (
  externalSystem: ExternalSystem
): ExternalSystemResponseDTO => {
  return {
    id: externalSystem.id,
    name: externalSystem.name,
    key: externalSystem.key,
    url: externalSystem.url,
  };
};
