import Room from "@/models/Room.model";

export async function createRoom() {
  try {
  } catch (error) {
    return res
      .json({
        status: "error",
        message: "Error creating room",
      })
      .status(500);
  }
}
