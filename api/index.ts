// Vercel serverless function entry point
import app from '../src/app';
import { connectDB } from '../src/utils/dbConnect';

// Connect to database (fire and forget for serverless)
connectDB();

export default app;
