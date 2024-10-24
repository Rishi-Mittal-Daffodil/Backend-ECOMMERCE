import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Wishlist } from "../models/wishlist.model.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import { CartItem } from "../models/cart.model.js";

const getAllProducts = asyncHandler(async (req, res) => {
    // const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    // TODO: get all Products based on query, sort, pagination
    try {
        const data = await Product.find({});
        if (!data) throw new ApiError(400, "Not Able to find Products");
        // console.log(res);
        res.status(200).json(
            new ApiResponse(200, data, "product fetch Successfully")
        );
    } catch (error) {
        throw new ApiError(400, "Error Occurs while fetching product  ");
    }
});

const getProductsByQuery = asyncHandler(async (req, res) => {
    const { page = 0, limit = 4 } = req.query;

    try {
        const products = await Product.find()
            .limit(limit * 1) // Convert limit to an integer and apply to the query
            .skip(page * limit) // Calculate the number of documents to skip
            .sort({ createdAt: -1 }); // Sort by creation date (newest first)

        const totalProducts = await Product.countDocuments();

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    totalProducts,
                    currentPage: page,
                    totalPages: Math.ceil(totalProducts / limit),
                    products,
                },
                "Product fetched successfully according to pagination "
            )
        );
    } catch (err) {
        throw new ApiError(400, err);
    }
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
    // console.log(req.files);
    const imagesPath = [];
    for (let item of req.files.images) {
        const cloudPath = await uploadOnCloudinary(item.path);
        if (!cloudPath)
            throw new ApiError(
                400,
                "Error occurs while uploading product images on cloudinary "
            );
        imagesPath.push({ url: cloudPath.url });
    }
    if (!imagesPath) throw new ApiError(400, "Please provide images");

    const categoryObj = await Category.findById(category);
    if (!categoryObj)
        throw new ApiError(400, "not able to find category Object");

    const ProductCreated = await Product.create({
        name,
        description,
        category: categoryObj,
        brand,
        sku,
        price,
        discountPrice,
        attributes,
        stock,
        images: imagesPath,
        isFeatured,
        status,
        tags,
        rating,
        weight,
    });

    if (!ProductCreated)
        throw new ApiError(400, "error occure while creating Product ");
    const wishlistItem = new Wishlist({
        product: ProductCreated._id,
        reference: [],
    });
    await wishlistItem.save();

    console.log("product created Successfully");
    res.status(201).json(
        new ApiResponse(200, ProductCreated, "Product created Successfully")
    );
});

const getProductById = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    //TODO: get Product by id
    // console.log(productId);
    try {
        const data = await Product.find({ _id: productId });
        if (!data)
            throw new ApiError(400, "Error Occure While Fetching product data");
        res.status(200).json(
            new ApiResponse(200, data, "product fetched successfully")
        );
    } catch (error) {
        throw new ApiError(400, "Error Occure while fetching product  ");
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.params;
        //TODO: update Product details like title, description, thumbnail
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
        console.log(req.body);

        if (!name) throw new ApiError(400, "name should be given");
        if (!description)
            throw new ApiError(400, "description should be given");
        if (!category) throw new ApiError(400, "category should be given ");
        if (!sku) throw new ApiError(400, "sku should be given ");
        if (!brand) throw new ApiError(400, "brand should be given ");
        if (!attributes) throw new ApiError(400, "attributes should be given ");
        if (!stock) throw new ApiError(400, "stock should be given ");
        if (!weight) throw new ApiError(400, "weight should be given ");
        const categoryObj = await Category.findById(category);
        if (!categoryObj)
            throw new ApiError(400, "not able to find category Object");
        const data = await Product.findByIdAndUpdate(
            productId,
            {
                name,
                description,
                category: categoryObj,
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
            },
            { new: true, runValidators: true }
        );
        console.log(data);
        res.status(200).json(
            new ApiResponse(200, data, "Product Updated Successfully")
        );
    } catch (error) {
        throw new ApiError(400, error);
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findByIdAndDelete(productId);
        await  CartItem.findByIdAndDelete(productId) ; 
        
        const imagesUrl = [];
        for (let image of product.images)
            imagesUrl.push(image.url.split("/").pop().split(".")[0]);
        const itemDeleted = await deleteOnCloudinary(imagesUrl);
        await Wishlist.deleteOne({ product: productId });
        if (!itemDeleted)
            throw new ApiError(
                400,
                "Error Occure while deleting images from cloudinary"
            );
        if (!product)
            throw new ApiError(400, "Error Occurs While Deleting product data");
        res.status(200).json(
            new ApiResponse(200, {}, "Product Deleted SuccessFully")
        );
    } catch (error) {
        throw new ApiError(400, error);
    }
});

const searchProducts = asyncHandler(async (req, res) => {
    const query = req.query.q;
    try {
        const results = await Product.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
            ],
        });
        res.status(200).json(
            new ApiResponse(200, results, "search data send successfully")
        );
    } catch (error) {
        res.status(500).json({ error: "An error occurred while searching." });
    }
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
    getProductsByQuery,
    searchProducts,
};
