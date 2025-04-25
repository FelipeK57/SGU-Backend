import { Request, Response } from "express";
import ExternalSystemRole from "../models/externalSystemRole.model";

export const createRole = async (req: Request, res: Response) => {
  const { name, externalSystemId } = req.body;

  try {
    const role = await ExternalSystemRole.create({
      name,
      externalSystemId,
    });

    res.status(201).json({ role: role });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getRoles = async (req: Request, res: Response) => {
  const { externalSystemId } = req.params;

  try {
    const externalSystemRoles = await ExternalSystemRole.findAll({
      where: { externalSystemId: externalSystemId },
    });

    if (externalSystemRoles.length === 0) {
      res
        .status(200)
        .json({ message: "No se encontraron roles en este sistema externo" });
      return;
    } else {
      res.status(200).json({ roles: externalSystemRoles });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
    return;
  }
};
