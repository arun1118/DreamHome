import React, { useEffect, useState } from 'react'
import {useNavigate} from "react-router-dom";
import ListingItem from '../components/ListingItem';

const Search = () => {
    const navigate=useNavigate();

    const [sidebardata,setSidebardata]=useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc'
    });

    const [loading, setLoading]=useState(false);
    const [listings, setListings]=useState([]);
    const [showMore,setShowMore]=useState(false);

    const handleChange=(e)=>{
        if(e.target.id==='all' || e.target.id==='sale' || e.target.id==='rent'){
            setSidebardata({...sidebardata, type: e.target.id});
        }
        if(e.target.id==='searchTerm'){
            setSidebardata({...sidebardata, searchTerm: e.target.value});
        }
        if(e.target.id==="parking" || e.target.id==="furnished" || e.target.id==="offer"){
            setSidebardata({...sidebardata, [e.target.id]: e.target.checked || e.target.checked==='true'?true:false})
        }
        if(e.target.id==='sort_order'){
            const sort=e.target.value.split("_")[0] || 'created_at';
            const order=e.target.value.split("_")[1] || 'desc';

            setSidebardata({...sidebardata, sort, order})
        }
    }

    useEffect(()=>{
        const urlParams=new URLSearchParams(location.search);
        const searchTermFromURL=urlParams.get("searchTerm")
        const typeFromURL=urlParams.get("type")
        const parkingFromURL=urlParams.get("parking")
        const furnishedFromURL=urlParams.get("furnished")
        const offerFromURL=urlParams.get("offer")
        const sortFromURL=urlParams.get("sort")
        const orderFromURL=urlParams.get("order")

        if(searchTermFromURL || typeFromURL || parkingFromURL || furnishedFromURL || offerFromURL || sortFromURL || orderFromURL){
            setSidebardata({
                searchTerm: searchTermFromURL || '',
                type: typeFromURL || 'all',
                parking: parkingFromURL==='true' ? true : false,
                furnished: furnishedFromURL==='true' ? true : false,
                offer: offerFromURL==='true' ? true : false,
                sort: sortFromURL || 'created_at',
                order: orderFromURL || 'desc'
            });
        }

        const fetchListing=async()=>{
            setLoading(true);
            setShowMore(false);
            const searchQuery=urlParams.toString();
            const res=await fetch(`/api/listing/get?${searchQuery}`)
            const data=await res.json();
            if(data.length>8) setShowMore(true);
            else setShowMore(false);
            // if(data.success===false){
            //     console.log(data.message);
            // }
            setLoading(false);
            setListings(data);
        }
        fetchListing();
    },[location.search])

    function handleSubmit(e){
        e.preventDefault();
        const urlParams=new URLSearchParams();
        
        urlParams.set("searchTerm",sidebardata.searchTerm)
        urlParams.set("type",sidebardata.type)
        urlParams.set("parking",sidebardata.parking)
        urlParams.set("furnished",sidebardata.furnished)
        urlParams.set("offer",sidebardata.offer)
        urlParams.set("sort",sidebardata.sort)
        urlParams.set("order",sidebardata.order)
        const searchQuery=urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    async function onShowMoreClick(){
        const numberOfListings=listings.length;
        const startIndex=numberOfListings;
        const urlParams=new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery=urlParams.toString();
        const res=await fetch(`/api/listing/get?${searchQuery}`);
        const data=await res.json();
        if(data.length < 9) setShowMore(false);
        setListings([...listings, ...data]);
    }

    return (
      <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                <div className='flex gap-2 items-center'>
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <input type="text" value={sidebardata.searchTerm} onChange={handleChange} id="searchTerm" placeholder='search...' className='border rounded-lg p-3 w-full'/>
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Type:</label>
                    <div className='flex gap-2'>
                        <input type="checkbox" onChange={handleChange} checked={sidebardata.type==='all'} className='w-5' id="all"/> <span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" onChange={handleChange} checked={sidebardata.type==='rent'} className='w-5' id="rent"/> <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" onChange={handleChange} checked={sidebardata.type==='sale'} className='w-5' id="sale"/> <span>Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" onChange={handleChange} checked={sidebardata.offer} className='w-5' id="offer"/> <span>Offer</span>
                    </div>
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Facility:</label>
                    <div className='flex gap-2'>
                        <input type="checkbox" onChange={handleChange} checked={sidebardata.furnished} className='w-5' id="furnished"/> <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" onChange={handleChange} checked={sidebardata.parking} className='w-5' id="parking"/> <span>Parking</span>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <label className='font-semibold'>Sort:</label>
                    <select id="sort_order" className='border rounded-lg p-3' onChange={handleChange} defaultValue={'created_at_desc'}>
                        <option value="regularPrice_desc">Price low to high</option>
                        <option value="regularPrice_asc">Price high to low</option>
                        <option value="createdAt_desc">Latest</option>
                        <option value="createdAt_asc">Oldest</option>
                    </select>
                </div>
                <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90'>Search</button>
            </form>
        </div>
        <div className='flex-1'>
            <h1 className='mt-5 font-semibold text-3xl border-b p-3 text-slate-700'>Listing Results :</h1>
            <div className='p-7 flex flex-wrap gap-4'>
                {loading && (<p className='text-xl text-slate-700 text-center w-full'>Loading...</p>)}
                {!loading && listings.length===0 && (<p className='text-xl text-slate-700'>No Listing found for this query!!</p>)}
                {!loading && listings && listings.map((listing)=> <ListingItem key={listing._id} listing={listing}/>)}

                {
                showMore &&
                (<button onClick={onShowMoreClick} className='text-green-700 p-7 hover:underline w-full text-center'>
                    Show More
                </button>)
                }
            </div>
        </div>
      </div>
    )
}

export default Search