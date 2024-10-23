import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: { type: Number, required: true, default: 1 },
    size: { type: String, required: true },
});

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [cartItemSchema],
    },
    { timestamps: true }
);

export const CartItem = mongoose.model("CartItem", cartItemSchema);
export const Cart = mongoose.model("Cart", cartSchema);
