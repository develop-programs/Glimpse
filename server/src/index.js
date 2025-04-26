import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { connectDb } from "./utils/Connection.js";
import { setupRoutes } from "./routes/index.route.js";
import { setupSocketHandlers } from "./sockets/index.js";

// Load environment variables
dotenv.config();

/**
 * Creates and configures the server
 * @param {number} PORT - Server port number
 * @returns {Object} Server components
 */
async function createServer(PORT = process.env.PORT || 5000) {
  try {
    // Initialize express and HTTP server
    const app = express();
    const httpServer = http.createServer(app);

    // Connect to MongoDB
    await connectDb();

    // Configure Socket.IO with CORS
    const io = new Server(httpServer, {
      path: "/ws",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    // Middleware setup
    app.use(express.json());
    app.use(cors());

    // API routes
    setupRoutes(app);

    // Socket.IO event handlers
    setupSocketHandlers(io);

    // Start the server
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    return { app, io, httpServer };
  } catch (error) {
    console.error("Server initialization failed:", error);
    process.exit(1);
  }
}

// Start the server
createServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
