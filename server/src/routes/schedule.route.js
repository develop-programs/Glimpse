import e, { Router } from "express";

/**
 * Sets up Express routes
 * @param {import('express').Application} app - Express application
 */

export default function SetupScheduleRoutes(app) {
  app.get("/api/schedule", (req, res) => {
    res.status(200).json({ status: "ok" });
  });
}
