import { Router } from "express";

const RoomRouter = Router();

// Get room information
RoomRouter.get("/:roomId", (req, res) => {
  const { roomId } = req.params;
  res.status(200).json({ roomId, status: "retrieved" });
});

// Create a new room
RoomRouter.post("/", (req, res) => {
  res.status(201).json({ roomId: "new-room-id", status: "created" });
});

// Route that was already there
RoomRouter.post("/create", (req, res) => {
  res.status(201).json({ roomId: "another-room-id", status: "created" });
});

export default RoomRouter;
