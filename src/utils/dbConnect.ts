import mongoose from 'mongoose';
import config from '../app/config';

// Global variable to cache database connection
let isConnected = false;

export const connectDB = async () => {
  // If already connected, return
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('Using existing database connection');
    return;
  }

  try {
    // Configure mongoose for serverless
    mongoose.set('strictQuery', false);

    const db = await mongoose.connect(config.database_uri as string, {
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    isConnected = db.connection.readyState === 1;
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

export const disconnectDB = async () => {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};
