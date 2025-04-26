import RoomRouter from "./Room.route.js";

/**
 * Sets up Express routes
 * @param {import('express').Application} app - Express application
 */
export function setupRoutes(app) {
  // Root endpoint
  app.get("/", (req, res) => {
    res.send("Hello, World!");
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // API routes
  app.use("/api/rooms", RoomRouter);
}
