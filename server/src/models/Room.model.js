import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      unique: true,
    },
    roomName: {
      type: String,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);
const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);
export default Room;
