import express from "express";
import { testConnection } from "./config/db";
import dotenv from "dotenv";
import cors from "cors";
// import routes
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to allow CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// User routes
app.use("/api/users", userRoutes);
// Auth routes
app.use("/api/auth", authRoutes);

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
