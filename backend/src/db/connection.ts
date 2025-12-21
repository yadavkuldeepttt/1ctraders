import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); // Add dotenv configuration if not imported in server.js

const connectDB = async () => {
    try {
        // Use MONGO_URI from .env
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');
    } catch (error:any) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

export default connectDB;
