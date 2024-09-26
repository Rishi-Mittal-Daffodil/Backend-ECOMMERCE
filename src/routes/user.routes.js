import { Router } from "express";
import {
    changePassword,
    getCurrentUser,
    loginUser,
    logoutUser,
    otpverification,
    registerUser,
    updateAccountDetails,
} from "../controllers/user.controller.js";
// import { upload } from "../middlewares/multer.middlewares.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post('/login/verify-otp' , otpverification)
router.post("/login", loginUser);
router.post("/logout", verifyToken, logoutUser);
router.post("/change-password", verifyToken, changePassword);
router.get("/current-user", verifyToken, getCurrentUser);
router.patch("/update-account", verifyToken, updateAccountDetails);

export default router;
