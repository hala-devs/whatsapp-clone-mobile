import mongoose from "mongoose";
import 'dotenv/config'
export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log("MongoDB connected with success");
    } catch(e){
console.log("Erorr when connecting db: "+ e.message);

    }
};