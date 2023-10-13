import Listing from "../models/listingModel.js";
import { errorHandler } from "../utils/customError.js";

export const createListing=async(req,res,next)=>{
    try {
        const listing=await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
}

export const deleteListing=async(req,res,next)=>{
    const listingToDelete=await Listing.findById(req.params.id);
    if(!listingToDelete){
        next(errorHandler(404, 'Listing not found'))
    }
    if(req.user.id!==listingToDelete.userRef){
        next(errorHandler(401, 'You can delete only your listings'));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing has been deleted');
    } catch (error) {
        next(error);
    }
}

export const updateListing=async(req,res,next)=>{
    const listingToUpdate=await Listing.findById(req.params.id);
    if(!listingToUpdate){
        next(errorHandler(404, 'Listing not found'))
    }
    if(req.user.id!==listingToUpdate.userRef){
        next(errorHandler(401, 'You can edit only your listing'))
    }

    try {
        // console.log(req.body);
        const updatedListing=await Listing.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json(updatedListing);
    } catch (error) {
        next(error)
    }
}

export const getListing=async(req,res,next)=>{
    try {
        const listing=await Listing.findById(req.params.id);
        if(!listing){
            next(errorHandler(404, 'Listing not found'));
        }
        res.status(200).json(listing);   
    } catch (error) {
        next(error);
    }
}