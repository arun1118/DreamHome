import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();


mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log("error in connecting DB : ",err);
})

const app=express();

app.listen(3000,()=>{
    console.log(`server running on port 3000`);
})