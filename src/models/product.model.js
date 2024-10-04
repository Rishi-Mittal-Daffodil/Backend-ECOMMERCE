import mongoose , {Schema} from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, unique: true },

        description: { type: String, required: true, trim: true },

        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        brand: { type: String, trim: true },

        sku: { type: String, required: true, unique: true },

        price: { type: Number, required: true },

        discountPrice: { type: Number, default: 0 },

        attributes: [
            {
                name: { type: String, required: true },
                value: { type: String, required: true },
            },
        ], // color, size

        stock: { type: Number, required: true, min: 0 },

        images: [
            { url: { type: String, required: true }, alt: { type: String } },
        ],

        isFeatured: { type: Boolean, default: false },

        status: {
            type: String,
            enum: ["active", "inactive", "out-of-stock"],
            default: "active",
        },

        tags: [String],

        ratings: { type: Number, default: 0 },

        reviews: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                rating: { type: Number, required: true, min: 1, max: 5 },
                comment: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],

        weight: { type: Number, required: true },

        dimensions: {
            length: { type: Number },
            width: { type: Number },
            height: { type: Number },
        },

        shipping: {
            type: {
                freeShipping: { type: Boolean, default: false },
                shippingCost: { type: Number, default: 0 },
            },
        },

        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);


export const Product = mongoose.model("Product" , productSchema ) ; 
