import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined in environment variables.");
        }
        await mongoose.connect(uri);
    } catch (error) {
        console.log("Error connecting to MongoDB:", error.message);
    }
};

export default connectMongoDB;