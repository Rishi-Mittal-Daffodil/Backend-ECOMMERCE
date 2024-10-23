import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { productSchema } from "../Schema.js";

const verifyAdmin = asyncHandler(async (req, res, next) => {
    try {
        const role = req?.user.role;
        if (role !== "admin") throw new ApiError(400, "Unauthorized request");
        next();
    } catch (error) {
        throw new ApiError(400, "Unauthorized request");
    }
});

const validateProduct = asyncHandler((req, res, next) => {
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
    const { error } = productSchema.validate({
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
    });
    console.log(error);
    // if (error) {
    //     const msg = error.details.map((err) => err.message).join(",");
    //     return res.status(400).json({ err: msg });
    // }
    next();
});

export { verifyAdmin, validateProduct };
