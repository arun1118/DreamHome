import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{
        type: String,
        require: true,
        unique: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true,
    },
    avatar:{
        type: String,
        default: "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"
    }
},
{timestamps: true});

const User=mongoose.model('User',userSchema);
export default User;