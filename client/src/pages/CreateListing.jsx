import React, { useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateListing = () => {
    const {currentUser}=useSelector((state)=>state.user);
    const navigate=useNavigate();

    const [files,setFiles]=useState([]);
    const [imageUploadError,setImageUploadError]=useState(null);
    const [isUploading,setIsUploading]=useState(false);
    const [error,setError]=useState(false);
    const [loading,setLoading]=useState(false);
    const [formData,setFormData]=useState({
        imageUrls: [], 
        name: '', description: '', address: '',
        bedrooms: 1, bathrooms: 1,
        type: 'rent', regularPrice: 200, discountPrice: 0,
        furnished: false, parking: false, offer: false
    });

    function handleImageSubmit(e){
        if((files.length>0) && (files.length + formData.imageUrls.length < 7)){
            setImageUploadError(false);
            setIsUploading(true);

            const allImgUploadPromise=[];
            for(var i=0;i<files.length;i++){
                allImgUploadPromise.push(storeImage(files[i]));
            }
            Promise.all(allImgUploadPromise)
            .then((urls)=>{
                setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)});
                setImageUploadError(false);
                setIsUploading(false);
            })
            .catch((err)=>{
                setImageUploadError('Image upload failed, try again! (check if the size if 2mb per image)');
                setIsUploading(false);
            });
        }
        else{
            setImageUploadError('Select only upto 6 images.');
            setIsUploading(false);
        }
    }

    async function storeImage(file){
        return new Promise((resolve,reject)=>{
            const storage=getStorage(app);
            const fileName=new Date().getTime()+file.name;
            const storageRef=ref(storage,fileName);
            const uploadTask=uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed',
            (snapshot)=>{
                const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
                console.log(progress);
            },
            (error)=>{
                reject(error);
            },
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{resolve(downloadUrl)})
            })
        })
    }

    function handleRemoveImage(idx){
        setFormData({...formData, imageUrls: formData.imageUrls.filter((url,i)=> i!==idx)})
    }

    function handleChange(e){
        const fieldToChange=e.target.id;
        if(fieldToChange==='sale' || fieldToChange==='rent'){
            setFormData({...formData, type: fieldToChange})
        }
        if(fieldToChange==='parking' || fieldToChange==='offer' || fieldToChange==='furnished'){
            setFormData({...formData, [fieldToChange]: e.target.checked})
        }
        if(e.target.type==='number' || e.target.type==='text' || e.target.type==='textarea'){
            setFormData({...formData, [fieldToChange]: e.target.value})
        }
    }

    async function handleSubmit(e){
        e.preventDefault();
        try {
            if(formData.imageUrls.length<1) return setError('you must Upload atleast one image');
            if(+formData.regularPrice < +formData.discountPrice) return setError('Discont Price must be lower than Regular price');
            setLoading(true);
            setError(false);
            console.log(uploadFormData);
            const res=await fetch(`/api/listing/create`,{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(uploadFormData)});
            const data=await res.json();
            setLoading(false);
            if(data.success===false){
                setError(data.message);
            }
            navigate(`/listing/${data._id}`);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }

    return (
      <main className='p-3 mx-auto max-w-4xl'>
          <h1 className='text-3xl text-center my-7 font-semibold'>Create a Listing</h1>
          <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
              {/* Listing detail input div */}
              <div className='flex flex-col gap-4 flex-1'>
                  {/* Inputs */}
                  <input type="text" onChange={handleChange} value={formData.name} id="name" placeholder='Name' minLength={6} maxLength={30} className='border p-3 rounded-lg' required/>
                  <textarea type="text" onChange={handleChange} value={formData.description} id="description" placeholder='Description' className='border p-3 rounded-lg' required/>
                  <input type="text" onChange={handleChange} value={formData.address} id="address" placeholder='Address' className='border p-3 rounded-lg' required/>
                  {/* Checkboxes */}
                  <div className='flex flex-wrap gap-6'>
                      <div className='flex gap-2'>
                          <input type="checkbox" className='w-5' id='sale' onChange={handleChange} checked={formData.type==="sale"}/>
                          <span>Sell</span>
                      </div>
                      <div className='flex gap-2'>
                          <input type="checkbox" className='w-5' id='rent' onChange={handleChange} checked={formData.type==="rent"}/>
                          <span>Rent</span>
                      </div>
                      <div className='flex gap-2'>
                          <input type="checkbox" className='w-5' id='parking' onChange={handleChange} checked={formData.parking}/>
                          <span>Parking</span>
                      </div>
                      <div className='flex gap-2'>
                          <input type="checkbox" className='w-5' id='furnished' onChange={handleChange} checked={formData.furnished}/>
                          <span>Furnished</span>
                      </div>
                      <div className='flex gap-2'>
                          <input type="checkbox" className='w-5' id='offer' onChange={handleChange} checked={formData.offer}/>
                          <span>Offer</span>
                      </div>
                  </div>
                  {/* Other Inputs */}
                  <div className='flex flex-wrap gap-6'>
                      <div className='flex items-center gap-2'>
                          <input type="number" onChange={handleChange} value={formData.bedrooms} id="bedrooms" required min={1} max={10} className='p-3 border border-gray-300 rounded-lg'/>
                          <p>Bedrooms</p>
                      </div>
                      <div className='flex items-center gap-2'>
                          <input type="number" onChange={handleChange} value={formData.bathrooms} id="bathrooms" required min={1} max={10} className='p-3 border border-gray-300 rounded-lg'/>
                          <p>Bathrooms</p>
                      </div>
                      <div className='flex items-center gap-2'>
                          <input type="number" onChange={handleChange} value={formData.regularPrice} id="regularPrice" required min={200} max={100000} className='p-3 border border-gray-300 rounded-lg'/>
                          <div className='flex flex-col items-center'>
                              <p>Regular Price</p>
                              <span className='text-xs'>&#40;₹ / month&#41;</span>
                          </div>
                      </div>
                      {formData.offer &&
                      <div className='flex items-center gap-2'>
                          <input type="number" onChange={handleChange} value={formData.discountPrice} id="discountPrice" required min={0} max={1000} className='p-3 border border-gray-300 rounded-lg'/>
                          <div className='flex flex-col items-center'>
                              <p>Discounted Price</p>
                              <span className='text-xs'>&#40;₹ / month&#41;</span>
                          </div>
                      </div>}
                  </div>

              </div>
              {/* Listing image input div */}
              <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold'>
                    Images
                    <span className='font-normal ml-2 text-gray-600'>First choosen image will be the cover page &#40;max 6&#41;</span>
                </p>
                <div className='flex gap-4'>
                    <input onChange={(e)=> setFiles(e.target.files)} type="file" id='images' accept='image/*' multiple className='p-3 border border-gray-300 rounded w-full'/>
                    <button type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80' disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
                <p className='text-red-700 text-xs'>{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageUrls.length>0 && formData.imageUrls.map((url,idx)=>{
                        return <div className='flex justify-between p-3 border items-center' key={url}>
                                    <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg'/>
                                    <button type='button' onClick={()=> handleRemoveImage(idx)} className='p-3 text-red-700 rounded-lg hover:opacity-80 uppercase'>Delete</button>
                                </div>
                        })
                  }
                <button disabled={loading || isUploading} className='bg-slate-700 rounded-lg text-white uppercaser hover:opacity-90 disabled:opacity-80 p-3'>
                    {loading ? 'Creating...' : 'Create Listing'}
                </button>
                {error && <p className='text-red-700 text-sm'>{error}</p>}
              </div>
          </form>
      </main>
    )
}

export default CreateListing