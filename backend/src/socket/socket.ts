// import { Server } from "socket.io";
// import http from "http";
// import express from "express";
// import dotenv from 'dotenv'; // Import dotenv if you're using it

// dotenv.config(); // Load environment variables

// const app = express();
// const server = http.createServer(app);

// // Determine the origin based on the environment
// const clientOrigin = process.env.NODE_ENV === 'production'
//   ? process.env.FRONTEND_URL // Use an environment variable for the production frontend URL
//   : "http://localhost:5173"; // Default for development

//   const io = new Server(server, {
//     cors: {
//       origin: clientOrigin,
//       methods: ["GET", "POST"],
//       credentials: true, // Important if using cookies or auth headers
//     },
//   });
  

// export const getReceiverSocketId = (receiverId: string) => {
//   return userSocketMap[receiverId];
// };

// const userSocketMap: { [key: string]: string } = {}; // { userId: socketId }

// io.on("connection", (socket) => {
//   console.log("a user connected", socket.id);

//   const userId = socket.handshake.query.userId as string;
//   if (userId) {
//     userSocketMap[userId] = socket.id;

//     io.emit("getOnlineUsers", Object.keys(userSocketMap));

//     socket.on("disconnect", () => {
//       console.log("user disconnected", socket.id);
//       delete userSocketMap[userId];
//       io.emit("getOnlineUsers", Object.keys(userSocketMap));
//     });
//   }
// });

// export { app, server, io };

// socket.ts
import { Server } from "socket.io";
import http from "http";
import { Express } from "express";

const userSocketMap: { [key: string]: string } = {};
let io: Server; // ✅ define io at module level

export const getReceiverSocketId = (receiverId: string) => {
  return userSocketMap[receiverId];
};

export const getIO = () => io; // ✅ export getter for io

export const createSocketServer = (app: Express) => {
  const server = http.createServer(app);

  const clientOrigin =
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : "http://localhost:5173";

  io = new Server(server, {
    cors: {
      origin: clientOrigin,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId as string;
    if (userId) {
      userSocketMap[userId] = socket.id;
      io.emit("getOnlineUsers", Object.keys(userSocketMap));

      socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      });
    }
  });

  return server;
};
