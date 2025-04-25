import { Request, Response } from "express";
import crypto from "crypto";
import ExternalSystem from "../models/externalSystems.model";
import { ExternalSystemResponseDTO } from "../dtos/externalSystem.dto";

export const generateUniqueApiKey = async (): Promise<string> => {
  let apiKey: string;

  do {
    apiKey = crypto.randomBytes(24).toString("hex");
  } while (await ExternalSystem.findOne({ where: { key: apiKey } }));

  return apiKey;
};

export const createExternalSystem = async (req: Request, res: Response) => {
  const { name, url } = req.body;
  try {
    const key = await generateUniqueApiKey();

    const externalSystem = await ExternalSystem.create({
      name,
      key,
      url,
    });
    res.status(201).json({ externalSystem: externalSystem });
    return;
  } catch (error) {
    res.status(500).json({ message: error });
    return;
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
