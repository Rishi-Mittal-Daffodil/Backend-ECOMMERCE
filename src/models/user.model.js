import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
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
        address: {
            street: { type: String, trim: true },
            city: { type: String, trim: true },
            state: { type: String, trim: true },
            postalCode: { type: String, trim: true },
            country: { type: String, trim: true },
        },
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
    console.log("ispaass" + this.password);

    return bcryptjs.compareSync(password, this.password);
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.RESET_TOKEN_SECRET,
        { expiresIn: process.env.RESET_TOKEN_EXPIRY }
    );
};

export const User = mongoose.model("User", userSchema);

// {
//     "firstName" :  "rishi" ,
//     "lastName" : "mittal" ,
//     "email" : "rishimittal676@gmial.com" ,
//     "password" : "Rishi@@123" ,
//     "role" : "admin" ,
//     "phone" : "12345678" ,
//     "address" : {
//         "street": "street1",
//         "city": "city1",
//         "state": "state1",
//         "postalCode": "postalCode1",
//         "country": "india"
//     }
// }
