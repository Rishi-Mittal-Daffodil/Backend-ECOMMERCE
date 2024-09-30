import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userRequestSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String,  trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: { type: String, required: true }, // password should be encrypted
        otp: {
            type: String,
        },
        otpExpirationTime: {
            type: Date,

        },
    },
    { timestamps: true }
);

userRequestSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = bcryptjs.hashSync(this.password, 10);
    next();
});

export const UserRequest = mongoose.model("UserRequest", userRequestSchema);
