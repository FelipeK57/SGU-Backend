import express from "express";
import { testConnection } from "./config/db";
import dotenv from "dotenv";
import cors from "cors";

import "../src/models/workArea.model";
import "../src/models/users.model";
import "../src/models/passwordResetCode.model";

// import routes
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import workAreaRoutes from "./routes/workArea.routes";
import externalSystemsRoutes from "./routes/externalSystems.routes";
import externalSystemRolesRoutes from "./routes/externalSystemRole.routes";
import externalSystemUserRoutes from "./routes/externalSystemUser.routes";
import adminRoutes from "./routes/admin.routes";
import apiExternalSystems from "./routes/apiExternalSystems.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// User routes
app.use("/api/users", userRoutes);
// Auth routes
app.use("/api/auth", authRoutes);
// Work Area routes
app.use("/api/work-areas", workAreaRoutes);
// External Systems routes
app.use("/api/external-systems", externalSystemsRoutes);
// External Systems Roles routes
app.use("/api/external-systems-roles", externalSystemRolesRoutes);
// External Systems Users routes
app.use("/api/external-system-user", externalSystemUserRoutes);
// Additional routes can be added here as needed
app.use("/api", adminRoutes);
// API external systems auth
app.use("/api/external-systems-auth", apiExternalSystems);

// Endpoint for testing the connection
app.get("/", (req, res) => {
  res.send("API funcionando 🔥");
});
// Test the connection
testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
