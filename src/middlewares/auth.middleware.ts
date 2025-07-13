import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
// Tipado personalizado para agregar `user` a `Request`
export interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

const jwtSecret = process.env.JWT_SECRET as string;

if (!jwtSecret) {
  throw new Error("JWT_SECRET no definido en .env");
}

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token no proporcionado" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Token inválido o expirado" });
    return;
  }
};
