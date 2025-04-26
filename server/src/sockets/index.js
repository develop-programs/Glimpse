/**
 * Sets up Socket.IO event handlers
 * @param {import('socket.io').Server} io - Socket.IO server instance
 */
export function setupSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("room:join", (room) => {
      const { user_name, user_id, email } = room;
      io.to(room).emit("room:join", {
        message: `${user_name} has joined the room`,
        user_id,
      });
      socket.join(room);
    });
    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}
