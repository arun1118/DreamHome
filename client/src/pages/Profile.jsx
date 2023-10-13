import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from "../firebase";
import {Link} from 'react-router-dom';
import { updateUserStart,updateUserSuccess,updateUserFailure,
  deleteUserStart, deleteUserSuccess, deleteUserFailure,
  signOutStart, signOutSuccess, signOutFailure } from '../redux/user/userSlice.js';

const Profile = () => {
    const {currentUser, loading, error}=useSelector((state)=> state.user);
    const dispatch=useDispatch();

    const [file,setFile]=useState(undefined);
    const [fileUploadProgress,setFileUploadProgress]=useState(0);
    const [fileUploadError,setFileUploadError]=useState(false);
    const [formData,setFormData]=useState({});
    const [updateSuccess,setUpdateSuccess]=useState(false);
    const [showListingError,setShowListingError]=useState(false);
    const [userListings,setUserListings]=useState([]);


    // console.log(fileUploadProgress,formData);

    const imgRef=useRef(null);

    useEffect(()=>{
      if(file){
        handleFileUpload(file);
      }
    },[file]);

    function handleFileUpload(file){
      const storage=getStorage(app);
      const fileName=new Date().getTime() + file.name;
      const storageRef=ref(storage,fileName);
      const uploadTask=uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
      (snapshot)=>{
        const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
        setFileUploadProgress(Math.round(progress));
      },
      (error)=>{
        setFileUploadError(true);
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=> setFormData({...formData, avatar : downloadURL}))
      }
      );
    }

    function handleChange(e){
      setFormData({...formData, [e.target.id] : e.target.value})
    }

    async function handleSubmit(e){
      e.preventDefault();
      try {
        dispatch(updateUserStart());
        const res=await fetch(`/api/user/update/${currentUser._id}`,{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(formData)});
        const data=await res.json();
        if(data.success===false){
          dispatch(updateUserFailure(data.message));
          return;
        }
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
      } catch (error) {
        dispatch(updateUserFailure(error.message));
      }
    }

    async function handleDeleteUser(){
      try {
        dispatch(deleteUserStart());
        const res=await fetch(`/api/user/delete/${currentUser._id}`,{method:'DELETE'});
        const data=await res.json();
        if(data.success===false){
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleteUserSuccess(data));
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
      }
    }

    async function handleSignOut(){
      try {
        dispatch(signOutStart());
        const res=await fetch('/api/auth/signout');
        const data=await res.json();
        if(data.success===false){
          dispatch(signOutFailure(data.message));
          return;
        }
        dispatch(signOutSuccess(data));
      } catch (error) {
        dispatch(signOutFailure(error.message));
      }
    }

    async function handleShowListings(){
      try {
        setShowListingError(false);
        const res=await fetch(`/api/user/listings/${currentUser._id}`);
        const data=await res.json();
        if(data.success===false){
          setShowListingError(true);
          return;
        }
        setUserListings(data);
      } catch (error) {
        setShowListingError(true);
      }
    }

    async function handleListingDelete(IdToDelete){
      try {
        const res=await fetch(`/api/listing/delete/${IdToDelete}`, {method: 'DELETE'});
        const data=res.json();
        if(data.success===false){
          console.log(data.message);
          return;
        }
        setUserListings((prev)=> prev.filter((listing)=> listing._id!==IdToDelete));
      } catch (error) {
        console.log(error.message);
      }
    }

    return (
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <input onChange={(e)=> setFile(e.target.files[0])} type='file' ref={imgRef} accept='image/*' hidden/>
          <img onClick={()=>{imgRef.current.click()}} src={formData?.avatar || currentUser.avatar} alt="profile"
            className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
          <p className='self-center text-sm'>
            {
            fileUploadError
            ?
            (<span className='text-red-700'>Error Uploading Image, Try again!! 	&#40;Image should be less than 2mb&#41; </span>)
            :
            fileUploadProgress>0 && fileUploadProgress<100
            ?
            (<span className='text-slate-700'>{`Uploading ${fileUploadProgress}%...`}</span>)
            :
            fileUploadProgress===100
            ?
            (<span className='text-green-700'>Image uploaded successfully.</span>)
            :
            (<></>)
            }
          </p>
          <input
          type='text' 
          id="username" 
          placeholder='username' 
          className='border p-3 rounded-lg' 
          defaultValue={currentUser.username}
          onChange={handleChange}
          />
          <input 
          type='email' 
          id="email" 
          placeholder='email' 
          className='border p-3 rounded-lg' 
          defaultValue={currentUser.email}
          onChange={handleChange}
          />
          <input 
          type='password' 
          id="password" 
          placeholder='password' 
          className='border p-3 rounded-lg'
          onChange={handleChange}
          />
          <button className='bg-slate-700 rounded-lg p-3 hover:opacity-95 disabled:opacity-80 uppercase text-white' disabled={loading}>
            {loading ? 'Loading...' : 'Update'}
          </button>
          <Link className='bg-green-700 p-3 uppercase rounded-r-lg text-center text-white hover:opacity-90' to={"/create-listing"}>
          Create Listing
          </Link>
        </form>
        <div className='flex justify-between mt-5'>
          <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
          <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
        </div>
        <p className='text-red-700 mt-5'>{error ? error : ''}</p>
        <p className='text-green-700 mt-5'>{updateSuccess ? "Successfully updated..." : ''}</p>
        <button onClick={handleShowListings} className='text-green-700 w-full'>Show Listings</button>
        <p className='text-red-700 mt-5'>{showListingError ? 'Error fetching Listings, try again!' : ''}</p>
        {userListings && userListings.length>0 && 
        <div className='flex flex-col gap-4'>
          <h1 className='font-semibold mt-7 text-2xl text-center'>Your Listings</h1>
          {
          userListings.map((listing)=>{
            return(
              <div key={listing._id} className='flex items-center justify-between p-3 border rounded-lg gap-4'>
                <Link to={`/listing/${listing._id}`}>
                  <img src={listing.imageUrls[0]} alt="listing-image" className='w-16 h-16 object-contain'/>
                </Link>
                <Link to={`/listing/${listing._id}`} className='text-slate-700 font-semibold truncate hover:underline flex-1'>
                  <p>{listing.name}</p>
                </Link>
                <div className='flex flex-col items-center'>
                  <button onClick={()=> handleListingDelete(listing._id)} className='uppercase text-red-700'>Delete</button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className='uppercase text-green-700'>Edit</button>
                  </Link>
                </div>
              </div>
            )
          })
          }
        </div>
        }
      </div>
    )
}

export default Profile