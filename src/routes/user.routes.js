import { Router } from "express";
import {
    changePassword,
    getCurrentUser,
    loginUser,
    logoutUser,
    otpverification,
    registerUserRequest,
    updateAccountDetails,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/user-request" , registerUserRequest) ; 
router.post('/user-request/verifyOtp' , otpverification)
router.post("/login", loginUser);
router.post("/logout", verifyToken, logoutUser);
router.post("/change-password", verifyToken, changePassword);
router.get("/current-user", verifyToken, getCurrentUser);
router.patch("/update-account", verifyToken, updateAccountDetails);

export default router;
