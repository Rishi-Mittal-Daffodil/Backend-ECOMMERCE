import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { OTP } from "../models/otp.model.js";
// import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";

//genrating access and refresh token .
const generateResetToken = async (userId) => {
    const user = await User.findById(userId);
    const resetToken = user.generateResetToken();
    user.resetToken = resetToken;
    await user.save({ validateBeforeSave: false });
    if (!resetToken)
        throw new ApiError(
            "something went wrong while generating  access and refresh token "
        );
    return { resetToken };
};

//registering user .
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, role, phone, address } =
        req.body;
    if (firstName === "") throw new ApiError(400, "Please Enter firstName");
    else if (lastName === "") throw new ApiError(400, "Please enter lastName");
    else if (email === "") throw new ApiError(400, "Please enter email");
    else if (password === "") throw new ApiError(400, "please enter password");

    const existedUser = await User.findOne({ email });
    if (existedUser) throw new ApiError(409, "user already exist");

    const user = await User.create({
        firstName,
        lastName,
        email: email,
        password,
        role: role || "customer",
        phone: phone || "",
        address: address || {},
    });

    const createdUser = await User.findById(user._id).select(
        "-password -resetToken"
    );
    if (!createdUser)
        throw new ApiError(
            500,
            "Something went wrong while registering the user "
        );
    const isOtpSend = await sendOTP(email);
    if (!isOtpSend) throw new ApiError(401, "Error occure while sending otp");

    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "User registered Successfully")
        );
});

//email verification
//first create otp-verification function .
// after creating otp user verify that using verify-otp route .
// once otp verify then i create refresh-token and verify token .

const sendOTP = async (email) => {
    const otp = otpGenerator.generate(6, {
        digits: true,
        alphabets: true,
        upperCase: false,
        specialChars: false,
    });
    try {
        const otpmodel = await OTP.create({ email: email, otp: otp });
        if (!otpmodel)
            throw new ApiError(400, "error occure while creating otp model . ");
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "rishimittal283110@gmail.com",
                pass: "gbncthgcfnkdwspq",
            },
        });
        const emailres = await transporter.sendMail({
            from: "rishimittal283110@gmail.com",
            to: email,
            subject: "OTP Verification",
            text: `Your OTP for verification is: ${otp}`,
        });
        console.log(emailres);
        return true;
    } catch (e) {
        await OTP.findOneAndDelete({ email, otp });
        console.log(e);
        return false;
    }
};

const otpverification = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp)
        throw new ApiError(400, "please enter valid otp Or email ");

    try {
        const user = await User.findOne({ email: email });
        if (!user) throw new ApiError(400, "email id not exist ");
        const otpRecord = await OTP.findOneAndDelete({ email, otp });
        if (!otpRecord)
            return res.status(400).send("Invalid OTP Resend Otp now ");
        const { resetToken } = await generateResetToken(user._id);
        const loggedInUser = await User.findById(user._id).select(
            "-password -resetToken"
        );

        const options = {
            httpOnly: true,
            secure: true,
        };

        res.status(200)
            .cookie("resetToken", resetToken, options)
            .json(
                new ApiResponse(200, {
                    user: loggedInUser,
                    resetToken,
                })
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
    if (!isPassword) throw new ApiError(401, "Please Enter Valid Credentials");

    const isOtpSend = await sendOTP(email);
    if (!isOtpSend) throw new ApiError(401, "Error occure while sending otp");

    return res
        .status(200)
        .send("password is correct now proceed to otp verification");
});

//logout user  .
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user?._id, {
        $unset: {
            resetToken: 1,
        },
    });

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("resetToken", options)
        .json(new ApiResponse(200, {}, "user logged out successfuly"));
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
        .json(new ApiError(200, {}, "Password Changed Sucessfully"));
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

export {
    registerUser,
    loginUser,
    logoutUser,
    changePassword,
    getCurrentUser,
    updateAccountDetails,
    otpverification,
};
