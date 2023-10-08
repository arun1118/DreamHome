import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { signInStart,signInSuccess,signInFailure } from '../redux/user/userSlice.js';

const SignIn = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();

    const [formData,setFormData]=useState({});

    // const [error,setError]=useState(null);
    // const [loading,setLoading]=useState(false);
    const {error,loading}=useSelector((state)=> state.user);
    
    function handleChange(e){
      const field=e.target.id;
      const value=e.target.value;
      setFormData({...formData,[field]:value});
    }

    async function handleSubmit(e){
      e.preventDefault();
      if(formData.email.length>1 && formData.password.length>1){
        try{
          // setLoading(true);
          dispatch(signInStart());
          const res=await fetch('/api/auth/signin',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(formData)});
          const data=await res.json();
          if(data.success===false){
            // setLoading(false);
            // setError(data.message);
            dispatch(signInFailure(data.message));
            return;
          }
          // setLoading(false);
          // setError(null);
          dispatch(signInSuccess(data));
          navigate("/");
        }
        catch(error) {
          // setLoading(false);
          // setError(error.message);
          dispatch(signInFailure(data.message));
        }
      }
      else{
        alert("Invalid form input")
      }
    }

    return (
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-center font-semibold text-3xl my-7'>SIGN IN</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

          <input type='email' placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
          <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>

          <button disabled={loading} className='bg-slate-700 uppercase rounded-lg hover:opacity-90 disabled:opacity-80 text-white p-3'>
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        
        </form>
        <div className='flex gap-2 mt-5'>
          <p>Create an account?</p>
            <Link to={"/sign-up"}>
              <span className='text-blue-700'>Sign Up</span>
            </Link>
        </div>
        {error && <p className='text-red-500 mt-5'>{error}</p>}
      </div>
    )
}

export default SignIn