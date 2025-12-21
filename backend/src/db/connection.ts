import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); // Add dotenv configuration if not imported in server.js

const connectDB = async () => {
    try {
        // Use MONGO_URI from .env
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error:any) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

export default connectDB;
