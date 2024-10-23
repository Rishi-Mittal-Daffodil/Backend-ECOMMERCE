import { Wishlist } from "../models/wishlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addWishlistProduct = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { productId } = req.params;
    console.log(userId, productId);

    try {
        let wishlistItem = await Wishlist.findOne({ product: productId });
        if (wishlistItem) {
            if (!wishlistItem?.reference?.includes(userId)) {
                wishlistItem.reference.push(userId);
                await wishlistItem.save();
                return res
                    .status(200)
                    .json(
                        new ApiResponse(
                            200,
                            wishlistItem,
                            "User added to the existing wishlist product."
                        )
                    );
            } else {
                return res.status(200).json(new ApiResponse(200 , "user already associate with this product ")) ; 
            }
        }
        return res
            .status(200)
            .json(
                new ApiResponse(200, {}, "item added to wishlist successfully")
            );
    } catch (error) {
        throw new ApiError(400, error);
    }
});

const getWishListItems = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    try {
        const wishlists = await Wishlist.find({ reference: userId })
            .populate("product") // This will fetch the product details
            .exec();
        if (!wishlists)
            throw new ApiError(
                400,
                "Error occure while fetching wishlist from database"
            );
        const data = wishlists.map((wishlist) => wishlist.product); // Return the list of products for the user
        return res
            .status(200)
            .json(new ApiResponse(200, data, "Wishlist fetched successfully"));
    } catch (error) {
        throw new ApiError(400, error);
    }
});

const updateWishlistProduct = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { productId } = req.params;
    try {
        let wishlistItem = await Wishlist.findOne({ product: productId });

        if (wishlistItem) {
            const userIndex = wishlistItem.reference.indexOf(userId);
            if (userIndex !== -1) {
                wishlistItem.reference.splice(userIndex, 1);
                await wishlistItem.save();
                res.status(200).json(
                    new ApiResponse(
                        200,
                        wishlistItem,
                        "User removed from the wishlist product."
                    )
                );
            } else {
                throw new ApiError(
                    400,
                    "User is not associated with this wishlist product."
                );
            }
        } else {
            throw new ApiError(400, "Product not found in the wishlist.");
        }
        return wishlistItem;
    } catch (error) {
        throw new ApiError(400, error);
    }
});

const isProductAddedInWishlist = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) return res.json({isAdded :  false }) ; 
    const { productId } = req.params;
    if (!productId) return;
    try {
        let wishlistItem = await Wishlist.findOne({ product: productId });
        if (!wishlistItem) throw new ApiError(400, "no wishlist item found ");
        if (wishlistItem?.reference?.includes(userId)) {
            return res.status(200).json({isAdded :  true}) ; 
        }
        else{
            return res.json({isAdded :  false }) ; 
        }
        // return res.json(400).json(new ApiResponse(400 , {isAdded :  null} ,  "something went wrong while fetch isAddedWishlist")) ; 
    } catch (error) {
        throw new ApiError(400, error);
    }
});

export { getWishListItems, addWishlistProduct, updateWishlistProduct , isProductAddedInWishlist };
