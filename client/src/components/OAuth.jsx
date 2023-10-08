import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth";
import { app } from '../firebase.js';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();

    async function handleGoogleSignIn(){
        try{
            const provider=new GoogleAuthProvider();
            const auth=getAuth(app);

            const result=await signInWithPopup(auth,provider);
            console.log(result);
            // console.log(result.user.displayName, result.user.email, result.user.photoURL);
            const res=await fetch('api/auth/google',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: result.user.displayName, email: result.user.email, photo: result.user.photoURL})
            });
            const data=await res.json();
            dispatch(signInSuccess(data));
            navigate("/");
        }
        catch(error){
            console.log("cannot sign in with google ",error);
        }
    }
    return (
        <button type='button' onClick={handleGoogleSignIn}
        className='bg-red-700 p-3 text-white uppercase rounded-lg hover:opacity-90'>Sign In with Google</button>
    )
}

export default OAuth;