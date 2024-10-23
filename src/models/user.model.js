import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: { type: String, required: true }, // password should be encrypted
        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer",
        },
        phone: { type: String, trim: true },
        address: [
            {
                house: { type: String, trim: true },
                street: { type: String, trim: true },
                city: { type: String, trim: true },
                state: { type: String, trim: true },
                postalCode: { type: String, trim: true },
                country: { type: String, trim: true, default: "India" },
                landmark: { type: String, trim: true },
                phone: { type: Number, trim: true },
            },
        ],
        otp: {
            type: Number,
        },
        otpExpirationTime: {
            type: Date,
        },
        refreshToken: String,
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

userSchema.methods.isPasswordCorrect = async function (password) {
    // console.log("ispaass" + this.password);

    return bcryptjs.compareSync(password, this.password);
};

export const User = mongoose.model("User", userSchema);
