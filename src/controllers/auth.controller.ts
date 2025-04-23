import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/users.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import PasswordResetCode from "../models/passwordResetCode.model";
import dayjs from "dayjs";
import nodemailer, { Transporter } from "nodemailer";

dotenv.config();

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Faltan datos" });
    return;
  }

  const user = await User.findOne({ where: { email, role: "admin" } });
  if (!user) {
    res
      .status(401)
      .json({ message: "Correo electrónico o contraseña incorrectos" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res
      .status(401)
      .json({ message: "Correo electrónico o contraseña incorrectos" });
    return;
  }

  if (!user.active) {
    res.status(401).json({ message: "Usuario deshabilitado" });
    return;
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  res.status(200).json({
    message: "Login exitoso",
    token,
    user: {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      documentType: user.documentType,
      documentNumber: user.documentNumber,
      role: user.role,
      email: user.email,
      active: user.active,
    },
  });

  return;
};

const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER as string,
    pass: process.env.GMAIL_PASS as string,
  },
});

export const sendCodeEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "Faltan datos" });
      return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({
        message:
          "No pudimos enviar el código, verifica que el correo esté correcto",
      });
      return;
    }

    if (!user.active) {
      res.status(401).json({ message: "Usuario deshabilitado" });
      return;
    }

    const existingCode = await PasswordResetCode.findOne({
      where: { email },
    });

    if (existingCode) {
      await existingCode.destroy();
    }

    const sixDigitCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = dayjs().add(5, "minute").toDate();

    await transporter.sendMail({
      from: `SGU Notificaciones ${process.env.GMAIL_USER as string}`,
      to: email,
      subject: "Código de recuperación",
      text: `Tu código de recuperación es: ${sixDigitCode}, recuerda que expira en 5 minutos.`,
    });

    await PasswordResetCode.create({
      email,
      code: sixDigitCode,
      expirationDate: expiresAt,
    });

    res.status(200).json({
      message:
        "El código ha sido enviado a tu correo electrónico, por favor revisa tu bandeja de entrada.",
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al enviar el correo" });
    return;
  }
};

export const validateCode = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400).json({ message: "Faltan datos" });
      return;
    }

    const codeData = await PasswordResetCode.findOne({
      where: { email, code },
    });

    if (codeData) {
      if (dayjs().isAfter(dayjs(codeData.expirationDate))) {
        res
          .status(401)
          .json({ message: "El código ha expirado. Solicita uno nuevo." });
        return;
      } else {
        await codeData.destroy();
        res.status(200).json({
          message:
            "El código es válido. Ahora puedes crear tu nueva contraseña.",
        });
        return;
      }
    } else {
      res
        .status(401)
        .json({ message: "El código no es válido. Intenta nuevamente." });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al validar el código" });
    return;
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { newPassword, email } = req.body;

  if (!newPassword || !email) {
    res.status(400).json({ message: "Faltan datos" });
    return;
  }

  await User.update(
    { password: await bcrypt.hash(newPassword, 10) },
    { where: { email } }
  )
    .then(() => {
      res
        .status(200)
        .json({ message: "La contraseña ha sido actualizada correctamente" });
      return;
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar la contraseña" });
      return;
    });
};

export const validateCurrentPassword = async (req: Request, res: Response) => {
  const { currentPassword, email } = req.body;

  if (!currentPassword || !email) {
    res.status(400).json({ message: "Faltan datos" });
    return;
  }

  const user = await User.findOne({ where: { email: email } });

  if (!user) {
    res.status(401).json({ message: "No se encontró un usuario" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    res.status(401).json({
      message: "La contraseña ingresada no es igual a la actual",
    });
    return;
  }

  res.status(200).json({
    message: "La contraseña es valida, puede continuar con el cambio",
  });
  return;
};
