import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

export const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("Error in connecting db: " + error)
    }
}