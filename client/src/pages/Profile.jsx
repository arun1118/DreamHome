import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from "../firebase";

const Profile = () => {
    const {currentUser}=useSelector((state)=> state.user);
    const [file,setFile]=useState(undefined);
    const [fileUploadProgress,setFileUploadProgress]=useState(0);
    const [fileUploadError,setFileUploadError]=useState(false);
    const [formData,setFormData]=useState({});

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

    return (
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
        <form className='flex flex-col gap-4'>
          <input onChange={(e)=> setFile(e.target.files[0])} type='file' ref={imgRef} accept='image/*' hidden/>
          <img onClick={()=>{imgRef.current.click()}} src={formData.avatar || currentUser.avatar} alt="profile"
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
          <input type='text' id="username" placeholder='username' className='border p-3 rounded-lg'/>
          <input type='email' id="email" placeholder='email' className='border p-3 rounded-lg'/>
          <input type='password' id="password" placeholder='password' className='border p-3 rounded-lg'/>
          <button className='bg-slate-700 rounded-lg p-3 hover:opacity-95 disabled:opacity-80 uppercase text-white'>Update</button>
        </form>
        <div className='flex justify-between mt-5'>
          <span className='text-red-700 cursor-pointer'>Delete Account</span>
          <span className='text-red-700 cursor-pointer'>Sign Out</span>
        </div>
      </div>
    )
}

export default Profile