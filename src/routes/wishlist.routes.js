import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    addWishlistProduct,
    getWishListItems,
    updateWishlistProduct,
} from "../controllers/wishlist.controller.js";
const router = Router();

router.use(verifyToken);

router.route("/").get(getWishListItems);
router
    .route("/:productId")
    .post(addWishlistProduct)
    .patch(updateWishlistProduct);

export default router;
