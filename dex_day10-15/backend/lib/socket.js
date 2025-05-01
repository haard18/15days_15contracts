import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Create Socket.IO server and allow CORS for development
const io = new Server(server, {
    cors: {
        origin: "*", // Update this in prod
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("🚀 New client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });
});

// Export both to use elsewhere
export { io, server };
