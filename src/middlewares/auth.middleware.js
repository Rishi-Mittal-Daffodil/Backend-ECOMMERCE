import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { refreshAccessToken } from "../controllers/user.controller.js";

const verifyToken = asyncHandler(async (req, _, next) => {
    try {
        const token =
        req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");
        //console.log(req.cookies);

        if (!token) throw new ApiError(401, "unauthorized request");

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodeToken?._id).select(
            "-password -refreshToken"
        );

        if (!user) throw new ApiError(401 , "user is not valid"); // UNAUTH ERROR CODE

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error);
    }
});

export { verifyToken };

