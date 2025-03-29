import express from "express";
import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/message.route";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { app, server } from "./socket/socket";
import cors from "cors";
dotenv.config();

const PORT = process.env.PORT || 5000;

// ✅ Setup allowed origin
const clientOrigin =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : "http://localhost:5173";

// ✅ Add this middleware to Express
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});
