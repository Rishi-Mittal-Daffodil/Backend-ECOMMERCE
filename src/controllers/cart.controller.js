import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart, CartItem } from "../models/cart.model.js";

const createCartItem = asyncHandler(async (req, res) => {
    const userId = req?.user._id;
    try {
        let cartPresent = await Cart.findOne({ user: userId });
        if (!cartPresent) {
            cartPresent = await Cart.create({ user: userId, items: [] });
        }
        const { productId, quantity, size } = req.body;
        const cartItem = new CartItem({ product: productId, quantity, size });
        await cartItem.save();
        const cart = await Cart.findById(cartPresent._id);
        console.log(cart, cartItem);

        if (!cart || !cartItem) {
            throw new ApiError(404, "Error occurs while creating cart item ");
        }
        cart.items.push(cartItem);
        await cart.save();
        return res
            .status(201)
            .json(
                new ApiResponse(201, cartItem, "Cart Item Created Successfully")
            );
    } catch (error) {
        throw new ApiError(404, error);
    }
});

const updateCartItem = asyncHandler(async (req, res) => {
    const userId = req?.user._id;
    try {
        let cartPresent = await Cart.findOne({ user: userId });
        if (!cartPresent)
            throw new ApiError(404, "cart not found for current user");
        const cartId = cartPresent._id;
        const cart = await Cart.findById(cartId);
        const { cartItemId, size, quantity } = req.body;
        const cartItem = await CartItem.findById(cartItemId);

        if (!cartItem) {
            throw new ApiError(404, "Error occurs while updating cart item ");
        }
        cartItem.quantity = quantity;
        cartItem.size = size;
        await cartItem.save();
        cart.items = cart.items.filter((item) => item.id !== cartItemId);
        await cart.save();
        cart.items.push(cartItem);
        await cart.save();
        res.status(200).json(
            new ApiResponse(201, cartItem, "Cart updated Created Successfully")
        );
    } catch (error) {
        throw new ApiError(404, error);
    }
});

const removeCartItemFromCart = asyncHandler(async (req, res) => {
    const userId = req?.user._id;
    try {
        let cartPresent = await Cart.findOne({ user: userId });
        if (!cartPresent)
            throw new ApiError(404, "cart not found for current user");
        const cartId = cartPresent._id;
        const { cartItemId } = req.params;
        const cart = await Cart.findById(cartId);
        const cartItem = await CartItem.findById(cartItemId);
        if (!cart || !cartItem) {
            throw new ApiError(404, "Error occurs while removing cart item ");
        }
        cart.items = cart.items.filter((item) => item.id !== cartItemId);
        await cart.save();
        await CartItem.findByIdAndDelete(cartItemId);
        res.status(200).json(
            new ApiResponse(200, cart, "cart item removed successfully")
        );
    } catch (error) {
        throw new ApiError(404, "Error occurs while removing cart item ");
    }
});

const getCartItems = asyncHandler(async (req, res) => {
    const userId = req?.user._id;
    try {
        let cartPresent = await Cart.findOne({ user: userId });
        if (!cartPresent)
            throw new ApiError(404, "cart not found for current user");
        const cartId = cartPresent._id;
        const cart = await Cart.findById(cartId).populate("items");
        if (!cart) {
            throw new ApiError(404, "Error occurs while fetching cart item ");
        }
        res.status(200).json(
            new ApiResponse(200, cart.items, "cart fetched successfully")
        );
    } catch (error) {
        throw new ApiError(404, error);
    }
});

export { createCartItem, removeCartItemFromCart, getCartItems, updateCartItem };
