import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const verifyToken = asyncHandler(async (req, _ , next) => {
  try {
    const token =
      req.cookies?.resetToken || req.header("Authorization")?.replace("Bearer ", "");
    console.log(token);

    if (!token) throw new ApiError(401, "unauthorized request");

    const decodeToken = jwt.verify(token, process.env.RESET_TOKEN_SECRET);

    const user = await User.findById(decodeToken?._id).select(
      "-password -resetToken"
    );

    if (!user) throw new ApiError("user is not valid");

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error);
  }
});





export { verifyToken };
