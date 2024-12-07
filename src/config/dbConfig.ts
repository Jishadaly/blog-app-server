import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const mongoUri:string = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mentorMe'

export async function connectToDb(){
  mongoose.connect(mongoUri)
  .then(()=>{
    console.log("successfully conected to database");
    
  }).catch((error)=>{
    console.error(error);
    process.exit(1);
  })
}