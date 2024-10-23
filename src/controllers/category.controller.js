import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";

const createCategory = asyncHandler(async (req, res) => {
    const { firstLevelCategory, secondLevelCategory, thirdLevelCategory } =
        req.body;
    if (!firstLevelCategory) {
        throw new ApiError("please insert all the categories");
    }
    const obj = {
        firstLevelCategory,
        secondLevelCategory,
        thirdLevelCategory,
    };
    const category = await Category.create(obj);
    if (!category)
        throw new ApiError(500, "Something went wrong while Creating category");

    res.status(201).json(
        new ApiResponse(200, category, "Category Created Sucessfully")
    );
});
const getCategories = asyncHandler(async (req, res) => {
    try {
        const data = await Category.find({});
        if (!data) throw new ApiError(400);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).send("Something Wrong While fetching category ");
    }
});

const getCategoriesByQueries = asyncHandler(async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) throw new ApiError(400, "please provide category query");
        const data = await Product.find({}).populate("category");
        const result = data.filter((item) => {
            if (
                item.category.firstLevelCategory === q ||
                item.category.secondLevelCategory === q ||
                item.category.thirdLevelCategory === q ||
                (item.category.firstLevelCategory === "Unisex" && q !== "Kids'")
            ) {
                return item;
            }
        });

        if (!data) throw new ApiError(400, "category  data is not found");
        res.status(200).json(
            new ApiResponse(200, result, "data  fetched successfully ")
        );
    } catch (error) {
        res.status(400).send(
            "Something Wrong While fetching category By query"
        );
    }
});

export { createCategory, getCategories, getCategoriesByQueries };

// i want to write a mongoose query to fetch products , i have product collection , in which there is category with their mogoose
