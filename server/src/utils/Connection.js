import mongoose from "mongoose";

/**
 * Connects to MongoDB database
 * @returns {Promise<string>} The connection host URL
 */
export async function connectDb() {
  try {
    // Check if already connected
    if (
      mongoose.ConnectionStates.connected === mongoose.connections[0].readyState
    ) {
      console.log("MongoDB is already connected");
      return mongoose.connection.host;
    }

    // Get MongoDB URI from environment variables or use default
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/myapp";

    // Set connection options for better stability and performance
    const options = {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    // Connect to MongoDB
    const { connection } = await mongoose.connect(mongoURI, options);

    console.log(`MongoDB connected: ${connection.host}`);
    return connection.host;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw new Error("Database connection failed: " + error.message);
  }
}
