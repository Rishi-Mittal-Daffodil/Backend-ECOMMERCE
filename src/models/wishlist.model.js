import mongoose, { Schema } from "mongoose";

const wishlistSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product", // Assuming your Product model is named 'Product'
        required: true,
    },
    reference: [
        {
            type: Schema.Types.ObjectId,
            ref: "User", // Assuming your User model is named 'User'
            required: true,
        },
    ],
});

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
