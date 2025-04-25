// src/config/sync.ts
import { sequelize } from "./db";
import "../models/workArea.model";
import "../models/users.model";
import "../models/passwordResetCode.model";
import "../models/externalSystems.model";
import "../models/externalSystemRole.model";
import "../models/externalSystemUser.model";

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("✅ Tablas sincronizadas correctamente.");
  } catch (error) {
    console.error("❌ Error al sincronizar la base de datos:", error);
  }
};

syncDatabase();
