import { Request, Response } from "express";
import WorkArea from "../models/workArea.model";
import { Op } from "sequelize";
import { WorkAreaResponseDto } from "../dtos/workArea.dts";
import User from "../models/users.model";

export const createWorkArea = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: "Faltan datos" });
      return;
    }

    const existingWorkArea = await WorkArea.findOne({
      where: {
        name: {
          [Op.iLike]: name,
        },
      },
    });
    if (existingWorkArea) {
      res
        .status(400)
        .json({ message: "Ya existe un área de trabajo con este nombre" });
      return;
    }

    const newWorkArea = await WorkArea.create({ name });

    res.status(201).json({
      id: newWorkArea.id,
      name: newWorkArea.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el área de trabajo" });
    return;
  }
};

export const getWorkAreas = async (req: Request, res: Response) => {
  try {
    const workAreas = await WorkArea.findAll();

    const workAreasResponse: WorkAreaResponseDto[] = workAreas.map(
      (workArea) => {
        return toWorkAreaResponseDto(workArea);
      }
    );

    res.status(200).json(workAreasResponse);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las áreas de trabajo" });
    return;
  }
};

export const updateWorkArea = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: "Faltan datos" });
      return;
    }

    const existingWorkArea = await WorkArea.findOne({
      where: {
        name: {
          [Op.iLike]: name,
        },
      },
    });
    if (existingWorkArea) {
      res
        .status(400)
        .json({ message: "Ya existe un área de trabajo con este nombre" });
      return;
    }

    const workArea = await WorkArea.findByPk(id);
    if (!workArea) {
      res.status(404).json({ message: "Área de trabajo no encontrada" });
      return;
    }

    workArea.name = name;
    await workArea.save();

    res.status(200).json({
      id: workArea.id,
      name: workArea.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el área de trabajo" });
    return;
  }
};

export const deleteWorkArea = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const workArea = await WorkArea.findByPk(id);
    if (!workArea) {
      res.status(404).json({ message: "Área de trabajo no encontrada" });
      return;
    }

    const userWithWorkArea = await User.findOne({ where: { workAreaId: id } });

    if (userWithWorkArea) {
      res
        .status(409)
        .json({
          message:
            "El área de trabajo no se puede eliminar porqué tiene usuarios asignados",
        });
      return;
    }

    await workArea.destroy();

    res.status(200).json({ message: "Área de trabajo eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el área de trabajo" });
    return;
  }
};

const toWorkAreaResponseDto = (workArea: WorkArea): WorkAreaResponseDto => {
  return {
    id: workArea.id,
    name: workArea.name,
  };
};
