import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    addWishlistProduct,
    getWishListItems,
    isProductAddedInWishlist,
    updateWishlistProduct,
} from "../controllers/wishlist.controller.js";
const router = Router();


router.route("/").get(verifyToken  ,getWishListItems);
router
    .route("/:productId")
    .get(verifyToken , isProductAddedInWishlist)
    .post(verifyToken , addWishlistProduct)
    .patch(verifyToken , updateWishlistProduct);

export default router;
