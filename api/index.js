import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import listingRouter from "./routes/listingRoute.js";
import cookieParser from "cookie-parser";

dotenv.config();


mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log("error in connecting DB : ",err);
})

const app=express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/user",userRouter);
app.use("/api/auth",authRouter);
app.use("/api/listing",listingRouter);

app.listen(3000,()=>{
    console.log(`server running on port 3000`);
})


app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message || "Internal server Error";
    res.status(statusCode).json({success: false, statusCode, message});
})