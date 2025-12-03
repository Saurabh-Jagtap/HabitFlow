import mongoose, { Schema } from "mongoose";
import { DB_NAME } from "../constants.js";

const connectdb = async () => {
    try {
        const connectionString = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB Connected! DB Host: ${connectionString.connection.host}`)
    } catch (error) {
        console.error("MongoDB connection Failed! ", error)
    }
}

export default connectdb;

