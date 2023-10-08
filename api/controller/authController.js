import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/customError.js";
import jwt from "jsonwebtoken";

export const signup=async (req,res,next)=>{
    const {username,email,password}=req.body;

    // hashing the user entered password
    const hashedPassword=bcryptjs.hashSync(password,8);

    // creating a new user
    const newUser=new User({username,email,password: hashedPassword});
    
    try{
       await newUser.save();
       res.status(201).json({message: "user created successfully"});
    }
    catch(error){
        next(error);
    }
}

export const signin=async (req,res,next)=>{
    const {email,password}=req.body;
    try{
        // searching for user existance in database
        const validUser=await User.findOne({email});
        if(!validUser) return next(errorHandler(404,'User not found!'));

        // comparing existing user's password with entered password
        const passwordMatch=bcryptjs.compareSync(password,validUser.password);
        if(!passwordMatch) return next(errorHandler(401,'Wrong Credentials..'));

        // creating a token
        const token=jwt.sign({id: validUser._id},process.env.JWT_SECRET);

        // destructuring the information from the validUse
        const {password: passwordOfUser, ...remainingInfo}=validUser._doc;

        // storing the token in cookie
        res.cookie('access_token', token, {httpOnly: true}).status(200).json(remainingInfo)
    }
    catch(error){
        next(error);
    }
    
}

export const google=async (req,res,next)=>{
    const {name,email}=req.body;
    try{
        const validUser=await User.findOne({email});
        if(validUser){
            const token=jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
            const {password: passwordOfUser, ...remainingInfo}=validUser._doc;
            res.cookie('access_token', token, {httpOnly: true}).status(200).json(remainingInfo)
        }
        else{
            const generatedPassword=Math.random().toString(36).slice(-8);
            const hashedPassword=bcryptjs.hashSync(generatedPassword,8);
            const newUser=new User({
                    username: name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),
                    email: email,
                    password: hashedPassword,
                    avatar: req.body.photo
                })
            await newUser.save();

            const token=jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
            const {password: passwordOfUser, ...remainingInfo}=newUser._doc;
            res.cookie('access_token', token, {httpOnly: true}).status(200).json(remainingInfo)
        }
    }
    catch(error){
        next(error);
    }
}