import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        firstLevelCategory: { type: String, required: true, trim: true },
        secondLevelCategory: { type: String, required: true, trim: true },
        thirdLevelCategory: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
