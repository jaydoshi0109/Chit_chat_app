// import express from "express";
// import authRoutes from "./routes/auth.route";
// import messageRoutes from "./routes/message.route";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import { app, server } from "./socket/socket";
// import cors from "cors";
// dotenv.config();

// const PORT = process.env.PORT || 5000;

// // ✅ Setup allowed origin
// const clientOrigin =
//   process.env.NODE_ENV === "production"
//     ? process.env.FRONTEND_URL
//     : "http://localhost:5173";

// // ✅ Add this middleware to Express
// app.use(
//   cors({
//     origin: clientOrigin,
//     credentials: true,
//   })
// );
// app.use(cookieParser());
// app.use(express.json());
// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

// server.listen(PORT, () => {
//   console.log("server is running on port " + PORT);
// });


import express from "express";
import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/message.route";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createSocketServer } from "./socket/socket"; // ✅ update

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const clientOrigin =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : "http://localhost:5173";

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

// ✅ Initialize socket server with same `app`
const server = createSocketServer(app);

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
