import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  }
);

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB Connected Successfully");
  } catch (error) {
    console.error("❌ DB Connection Failed:", error);
  }
};

export { sequelize };
