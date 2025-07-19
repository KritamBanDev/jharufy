import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Prevent multiple connections in serverless environment
    if (mongoose.connections[0].readyState) {
      console.log('MongoDB already connected');
      return;
    }

    await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0,   // Disable mongoose buffering
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error; // Don't exit process in serverless
  }
}