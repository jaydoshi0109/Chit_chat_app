import express from "express";
import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/message.route";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { app, server } from "../src/socket/socket";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});
