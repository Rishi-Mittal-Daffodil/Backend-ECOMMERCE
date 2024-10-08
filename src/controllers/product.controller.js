import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllProducts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    //TODO: get all Products based on query, sort, pagination
});

const publishAProduct = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        category,
        brand,
        sku,
        price,
        discountPrice,
        attributes,
        stock,
        isFeatured,
        status,
        tags,
        rating,
        weight,
    } = req.body;

    if (!name) throw new ApiError(400, "name should be given");
    if (!description) throw new ApiError(400, "description should be given");
    if (!category) throw new ApiError(400, "category should be given ");
    if (!sku) throw new ApiError(400, "sku should be given ");
    if (!brand) throw new ApiError(400, "brand should be given ");
    if (!attributes) throw new ApiError(400, "attributes should be given ");
    if (!stock) throw new ApiError(400, "stock should be given ");
    if (!weight) throw new ApiError(400, "weight should be given ");
    console.log(req.files);
    const imagesPath = [];
    for (let item of req.files.images) {
        const cloudPath = await uploadOnCloudinary(item.path);
        if (!cloudPath)
            throw new ApiError(
                400,
                "Error occure while uploading product images on cloudinary "
            );
        imagesPath.push({ url: cloudPath.url});
    }
    if (!imagesPath) throw new ApiError(400, "Please provide images");
    
    const categoryObj =  await Category.findById(category) ; 
    if(!categoryObj) throw new ApiError(400 , "not able to find category Object") ; 

    const ProductCreated = await  Product.create({
        name,
        description,
        category : categoryObj,
        brand,
        sku,
        price,
        discountPrice,
        attributes,
        stock,
        images : imagesPath ,  
        isFeatured,
        status,
        tags,
        rating,
        weight,
    });

    if(!ProductCreated) throw  new ApiError(400  , 'error occure while creating Product ') ;
    console.log("product created Successfully");
    res.status(201).json(new ApiResponse(200 , ProductCreated , "Product created Successfully")) ;
});

const getProductById = asyncHandler(async (req, res) => {
    const { ProductId } = req.params;
    //TODO: get Product by id
});

const updateProduct = asyncHandler(async (req, res) => {
    const { ProductId } = req.params;
    //TODO: update Product details like title, description, thumbnail
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { ProductId } = req.params;
    //TODO: delete Product
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { ProductId } = req.params;
});

export {
    getAllProducts,
    publishAProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    togglePublishStatus,
};
