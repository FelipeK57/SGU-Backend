import { Request, Response } from "express";
import ExternalSystemUser from "../models/externalSystemUser.model";

export const updateRole = async (req: Request, res: Response) => {
  const { externalSystemId, userId, roleId } = req.body;
  try {
    const user = await ExternalSystemUser.findOne({
      where: {
        externalSystemId: externalSystemId,
        userId: userId,
      },
    });

    if (!user) {
      res.status(404).json({ message: "No se encontro un usuario" });
      return;
    }

    user.externalRoleId = roleId;
    await user.save();

    res.status(200).json({
      message: "El rol del usuario ha sido actualizado correctamente",
      data: user,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
    return;
  }
};
