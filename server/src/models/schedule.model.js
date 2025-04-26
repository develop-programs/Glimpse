import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    scheduleTime: {
      type: Date,
      required: true,
    },
    isProtected: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Schedule =
  mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);
export default Schedule;
