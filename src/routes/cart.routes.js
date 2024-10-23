import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { Product } from "../models/product.model.js";
import {
    getCartItems,
    removeCartItemFromCart,
    createCartItem,
    updateCartItem,
} from "../controllers/cart.controller.js";
const router = Router();
router.use(verifyToken);

router.route("/").get(getCartItems).post(createCartItem).patch(updateCartItem);

router.route("/:cartItemId").delete(removeCartItemFromCart);

export default router;
