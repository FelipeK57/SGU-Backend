// src/config/sync.ts
import { sequelize } from "./db";
import "../models/workArea.model";
import "../models/users.model";
import "../models/passwordResetCode.model";

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // ⚠️ Usa alter: true si no querés borrar tablas
    console.log("✅ Tablas sincronizadas correctamente.");
  } catch (error) {
    console.error("❌ Error al sincronizar la base de datos:", error);
  }
};

syncDatabase();
