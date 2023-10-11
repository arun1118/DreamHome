import bcryptjs from 'bcryptjs';
import User from '../models/userModel.js';
import { errorHandler } from '../utils/customError.js';

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