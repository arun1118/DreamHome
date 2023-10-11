import jwt from 'jsonwebtoken';
import { errorHandler } from './customError.js';

export const verifyToken= (req,res,next)=>{
    const token=req.cookies.access_token;

    if(!token) next(errorHandler(401, 'Unauthorised'));

    jwt.verify(token, process.env.JWT_SECRET, (err,user)=>{
        if(err) next(errorHandler(403, 'Invalid token'));
        req.user=user;
        next();
    })
}