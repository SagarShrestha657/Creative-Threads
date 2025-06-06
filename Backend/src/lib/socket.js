// server.js or index.js (your socket.io setup file)
import { Server } from "socket.io";
import http from "http";
import express from "express";
import NotificationController from "../controller/notificationController.js";  // Import the NotificationController

const app = express();
const server = http.createServer(app);

// Map of userId -> socket.id
const onlineUsers = new Map();

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://creative-theards.vercel.app",
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // User joins with their ID
  socket.on("join", (userId) => {
    socket.join(userId); // Join their own room
    onlineUsers.set(userId, socket.id);
    
    // Send current list of online users to the newly connected user
    socket.emit("onlineUsers", Array.from(onlineUsers.keys()));
    
    // Broadcast to all clients that this user is online
    io.emit("userOnline", userId);
  });

  // Handle message sending
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    const fullMessage = {
      senderId,
      message,
      createdAt: new Date().toISOString(),
    };

    if (receiverSocketId) {
      io.to(receiverId).emit("receiveMessage", fullMessage);
    }
  });

  socket.on("sendNotification", async ({ senderId, receiverId, type, postId }) => {
    try {
      // Save notification to the database
      const notification = await NotificationController.sendNotification({ senderId, receiverId, type, postId });

      // Emit notification to the receiver in real time
      NotificationController.emitNotification(io, receiverId, notification);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  });

  // On disconnect
  socket.on("disconnect", () => {
    let disconnectedUserId = null;
    for (const [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        disconnectedUserId = userId;
        onlineUsers.delete(userId);
        break;
      }
    }
    if (disconnectedUserId) {
      // Broadcast to all clients that this user is offline
      io.emit("userOffline", disconnectedUserId);
    }
  });
});

export { io, app, server };
