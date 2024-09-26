import mongoose from "mongoose";

const categorySchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);
