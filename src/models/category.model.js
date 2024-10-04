import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        firstLevelCategory: {
            name : {type: String, required: true,trim: true,} , 
            secondLevelCategory: {
                name : {type: String, required: true,trim: true,} , 
                thirdLevelCategory: {
                    name : {type: String, required: true,trim: true,} , 
                },
            },
        },
    },
    { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);



