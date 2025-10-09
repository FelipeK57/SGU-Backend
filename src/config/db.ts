import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const useSSL = process.env.DB_SSL === "true";

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  ...(useSSL && {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }),
});

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB Connected Successfully");
  } catch (error) {
    console.error("❌ DB Connection Failed:", error);
  }
};

export { sequelize };
