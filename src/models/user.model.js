import mongoose , {Schema} from "mongoose";
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
            enum: ["customer", "admin", "vendor"],
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

        resetToken: String,
        resetExpires: Date,

        isEmailVerified: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },

        cart: [
            {
                product: { type: Schema.Types.ObjectId, ref: "Product" },
                quantity: { type: Number, required: true, min: 1 },
            },
        ],

        wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],

        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = bcryptjs.hashSync(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    console.log("ispaass" + this.password);

    return bcryptjs.compareSync(password, this.password);
};


userSchema.methods.generateResetToken = function () {
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