import mongoose, {isValidObjectId} from "mongoose"
import {Product} from "../models/Product.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllProducts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all Products based on query, sort, pagination
})

const publishAProduct = asyncHandler(async (req, res) => {
    // const { title, description , category} = req.body
    // const user = await User.findById(req.user?._id) ; 
    // if(!user)  throw new ApiError(400 , "error occure while fetching user details") ; 

    // if(!title) throw new ApiError(400 , "title should be given");
    // if(!description) throw new ApiError(400 , "description should be given");
    // if(!category) throw new ApiError(400  , "category should be given ")
    console.log('helloo');
    const localProductPath = req.files?.ProductFile[0]?.path ; 
    console.log(localProductPath);
    // const localThumbnailPath =  req.files?.thumbnail[0]?.path ;  

    // if(!localProductPath) throw new ApiError(400 , "Please provide a Product ")
    // if(!localThumbnailPath) throw new ApiError(400 , "Please provide a thumbnail") 
    // const ProductPath = await uploadOnCloudinary(localProductPath) ; 
    // const thumbnailPath =  await uploadOnCloudinary(localThumbnailPath) ; 

    // if(!ProductPath && !thumbnailPath) throw  new ApiError(400 , "Error occure while uploading Product and thumbnail on cloudinary ") ; 

    // const ProductCreated = await  Product.create({
    //     ProductFile : ProductPath?.url , 
    //     thumbnail :  thumbnailPath?.url ,
    //     title :  title , 
    //     category :  category ,
    //     description :  description  ,  
    //     owner :  user ,  
    //     duration : ProductPath?.duration || 0 
    // });

    // if(!ProductCreated) throw  new ApiError(400  , 'error occure while creating Product model') ; 
    // res.status(201).json(new ApiResponse(200 , ProductCreated , "Product created Successfully")) ; 
})

const getProductById = asyncHandler(async (req, res) => {
    const { ProductId } = req.params
    //TODO: get Product by id
})

const updateProduct = asyncHandler(async (req, res) => {
    const { ProductId } = req.params
    //TODO: update Product details like title, description, thumbnail

})

const deleteProduct = asyncHandler(async (req, res) => {
    const { ProductId } = req.params
    //TODO: delete Product
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { ProductId } = req.params
})

export {
    getAllProducts,
    publishAProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    togglePublishStatus
}