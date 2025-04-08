// src/config/sync.ts
import { sequelize } from "./db";
import "../models/users.model";

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // ⚠️ Usa alter: true si no querés borrar tablas
    console.log("✅ Tablas sincronizadas correctamente.");
  } catch (error) {
    console.error("❌ Error al sincronizar la base de datos:", error);
  }
};

syncDatabase();
