import bcryptjs from 'bcryptjs';
import User from '../models/userModel.js';
import { errorHandler } from '../utils/customError.js';
import Listing from "../models/listingModel.js";

export const updateUser= async (req, res, next)=>{
    const IDofUserUpdate=req.params.id;

    if(req.user.id!=IDofUserUpdate) next(errorHandler(401, 'Invalid User trying to update profile'));

    try{
        if(req.body.password){
            req.body.password=bcryptjs.hashSync(req.body.password,8);
        }

        const updatedUser=await User.findByIdAndUpdate(IDofUserUpdate,{
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, {new: true});

        const{password, ...remainingInfo}=updatedUser._doc;

        res.status(200).json(remainingInfo);
    }
    catch(error){
        next(error);
    }
}

export const deleteUser=async (req,res,next)=>{
    const IDofUserDelete=req.params.id;
    if(req.user.id!=IDofUserDelete) next(errorHandler(401, 'Invalid User trying to delete account'));

    try {
        await User.findByIdAndDelete(IDofUserDelete);
        res.clearCookie('access_token');
        res.status(200).json({message : 'User has been deleted....'});
    } catch (error) {
        next(error);
    }
}

export const getUserListings=async(req,res,next)=>{
    if(req.user.id===req.params.id){
        try {
            const listings=await Listing.find({userRef: req.params.id});
            res.status(200).json(listings);    
        } catch (error) {
            next(error);
        }
    }
    else{
        next(errorHandler(401,'You can view only your listings'));
    }
}