import { Request, Response } from "express";
import User from "../models/users.model";
import ExternalSystem from "../models/externalSystems.model";
import ExternalSystemUser from "../models/externalSystemUser.model";
import ExternalSystemRole from "../models/externalSystemRole.model";
import bcrypt from "bcrypt";

const normalizeUrl = (url: string) =>
  url.trim().toLowerCase().replace(/\/+$/, "");

export const loginExternalSystem = async (req: Request, res: Response) => {
  try {
    const { email, password, apiKey } = req.body;
    const origin = req.headers.origin;

    if (!email || !password || !apiKey) {
      res.status(400).json({ message: "Faltan datos" });
      return;
    }

    if (!origin) {
      res.status(403).json({ message: "Origen no especificado" });
      return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res
        .status(401)
        .json({ message: "Correo electrónico o contraseña incorrectos" });
      return;
    }
    if (!user.active) {
      res.status(401).json({ message: "Usuario deshabilitado" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res
        .status(401)
        .json({ message: "Correo electrónico o contraseña incorrectos" });
      return;
    }

    const externalSystem = await ExternalSystem.findOne({
      where: { key: apiKey },
    });
    if (!externalSystem) {
      res.status(401).json({ message: "Sistema externo no encontrado" });
      return;
    }

    if (normalizeUrl(origin) !== normalizeUrl(externalSystem.url)) {
      res.status(403).json({ message: "Origen no autorizado" });
      return;
    }

    const externalSystemUser = await ExternalSystemUser.findOne({
      where: {
        userId: user.id,
        externalSystemId: externalSystem.id,
      },
    });

    if (!externalSystemUser) {
      res
        .status(401)
        .json({ message: "Usuario no autorizado en el sistema externo" });
      return;
    }

    const externalRole = await ExternalSystemRole.findByPk(
      externalSystemUser.externalRoleId
    );
    if (!externalRole) {
      res.status(401).json({ message: "Rol externo no encontrado" });
      return;
    }

    if (externalRole.name === "Sin rol") {
      res.status(403).json({ message: "Acceso denegado: Rol no permitido" });
      return;
    }

    res.status(200).json({
      message: "Login exitoso",
      user: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: externalRole.name,
      },
    });
    return;
  } catch (error) {
    console.error("Error en loginExternalSystem:", error);
    res.status(500).json({ message: "Error en el servidor" });
    return;
  }
};
