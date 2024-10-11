import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { UserRequest } from "../models/userrequest.model.js";
import { EMAIL_FROM } from "../config/constants.js";
import { Wishlist } from "../models/wishlist.model.js";

//genrating access and refresh token .
const generateRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    const refreshToken = jwt.sign(
        {
            _id: user._id,
        },
        process.env.RESET_TOKEN_SECRET,
        { expiresIn: process.env.RESET_TOKEN_EXPIRY }
    );
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    if (!refreshToken)
        throw new ApiError(
            "something went wrong while generating refresh token "
        );
    return { refreshToken };
};

//registering user .
const registerUserRequest = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (firstName === "") throw new ApiError(400, "Please Enter firstName");
    else if (email === "") throw new ApiError(400, "Please enter email");
    else if (password === "") throw new ApiError(400, "please enter password");

    const existedUser = await User.findOne({ email });
    await UserRequest.deleteMany({ email: email }); //deleting existing user in user-request  .
    if (existedUser)
        new ApiResponse(200, {}, "user with this email already exists");

    const otp = await sendOTP(email);
    if (!otp) throw new ApiError(401, "Error occurs while sending otp");

    const user = await UserRequest.create({
        firstName,
        lastName: lastName || "",
        email: email,
        password,
        otp: otp,
        otpExpirationTime: Date.now() + 5 * 60 * 1000,
    });

    const requestUser = await UserRequest.findById(user._id).select(
        "-password "
    );

    if (!requestUser)
        throw new ApiError(
            500,
            "Something went wrong while registering the user "
        );

    return res
        .status(201)
        .json(
            new ApiResponse(200, requestUser, "Request Created Successfully")
        );
});

//email verification
const sendOTP = async (email) => {
    const otp = otpGenerator.generate(6, {
        digits: true,
        alphabets: true,
        upperCase: false,
        specialChars: false,
    });
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: EMAIL_FROM,
                pass: "gbncthgcfnkdwspq",
            },
        });
        const emailres = await transporter.sendMail({
            from: EMAIL_FROM,
            to: email,
            subject: "OTP Verification",
            text: `Your OTP for verification is: ${otp}`,
        });
        console.log(emailres);
        return otp;
    } catch (e) {
        console.log(e);
        return null;
    }
};

const otpverification = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp || typeof email === typeof {})
        throw new ApiError(400, "please enter valid otp Or email ");
    try {
        console.log(email);
        const user = await UserRequest.findOne({ email });
        if (!user) throw new ApiError(400, "email id not exist ");
        const { firstName, lastName, password } = user;

        if (!(user.otp === otp)) {
            res.status(400).json({
                message: "otp is invalid ",
            });
            return;
        }

        const originalUser = await User.create({
            firstName,
            lastName: lastName || "",
            email,
            password,
        });
        await UserRequest.deleteOne({ _id: user._id });

        const createdUser = await User.findOne({
            _id: originalUser._id,
        }).select("-password");
        res.status(200).json(
            new ApiResponse(200, createdUser, "user created successfully")
        );
    } catch (error) {
        console.log(error);
        return false;
    }
});

//login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email) throw new ApiError(400, "Please Provide email or password");

    const user = await User.findOne({ email });
    console.log(user);

    if (!user) throw new ApiError(404, "user not Exist");

    const isPassword = await user.isPasswordCorrect(password);
    if (!isPassword) {
        res.status(400).json({
            message: "user not found",
        });
    }

    const { refreshToken } = await generateRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password ");

    const options = {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 30 * 1000,
        sameSite: "none",
    };

    res.status(200)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser,
                refreshToken,
            })
        );
});

//logout user  .
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user?._id, {
        $unset: {
            refreshToken: 1,
        },
    });

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "user logged out successfully"));
});

//change password
const changePassword = asyncHandler(async (req, res) => {
    const { currPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) throw new ApiError(401, "User Not Exist");

    const iscorrect = await user.isPasswordCorrect(currPassword);

    if (!iscorrect) throw new ApiError(401, "Password is incorrect");

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(201)
        .json(new ApiError(200, {}, "Password Changed Successfully"));
});

//to return the current user
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "user fetched successfully"));
});

//to update account information .
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, role, phone, address } = req.body;

    if (firstName === "") throw new ApiError(400, "Please Enter firstName");
    else if (lastName === "") throw new ApiError(400, "Please enter lastName");
    else if (email === "") throw new ApiError(400, "Please enter email");
    else if (password === "") throw new ApiError(400, "please enter password");

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                firstName,
                lastName,
                email: email.toLowerCase(),
                role: role || "customer",
                phone: phone || "",
                address: address || {},
            },
        },
        { new: true }
    ).select("-password");

    res.status(200).json(
        new ApiResponse(200, user, "Account details update Successfully")
    );
});

const deleteAccount = asyncHandler(async (req, res) => {
    try {
        const id = req?.user?._id;
        if (!id)
            throw new ApiError(400, "Error Occurs while deleting account ");
        const user = await User.findByIdAndDelete(id);
        if (!user)
            throw new ApiError(400, "Error Occurs While deleting account ");
        const options = {
            httpOnly: true,
            secure: true,
        };
        res.status(200)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, user, "Account Deleted Successfully"));
    } catch (error) {
        throw new ApiError(400, error);
    }
});

const checkStatus = asyncHandler((req, res) => {
    const user = req?.user;
    if (!user) {
        res.status(400).message(
            "not Authorized person person for this task . "
        );
    }
    res.status(200).json(user);
});

export {
    registerUserRequest,
    loginUser,
    logoutUser,
    changePassword,
    getCurrentUser,
    updateAccountDetails,
    otpverification,
    deleteAccount,
    checkStatus,
};
