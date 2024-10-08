import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Category } from "../models/category.model.js";

const createCategory = asyncHandler(async (req, res) => {
    const {firstLevelCategory , secondLevelCategory , thirdLevelCategory} = req.body;
    if (!firstLevelCategory) {
        throw new ApiError("please insert all the categories");
    }
    const obj = {
        firstLevelCategory,
        secondLevelCategory ,
        thirdLevelCategory
    };
    const category = await Category.create(obj);
    if (!category)
        throw new ApiError(500, "Something went wrong while Creating category");

    res.status(201).json(
        new ApiResponse(200, category, "Category Created Sucessfully")
    );
});
const getCategories = asyncHandler(async (req , res)=>{
    try {
        const data = await Category.find({}) ; 
        if(!data)  throw new ApiError(400) ; 
        res.status(200).json(data)  ; 
    } catch (error) {
        res.status(400).send("Something Wrong While fetching category ") ;  
    }
})

export {
    createCategory, 
    getCategories
}