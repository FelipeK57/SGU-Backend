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
    await sequelize.sync({ alter: true });
    console.log("✅ tables were synchronized correctly.");
  } catch (error) {
    console.error("❌ error in database synchronization:", error);
  }
};

syncDatabase();
