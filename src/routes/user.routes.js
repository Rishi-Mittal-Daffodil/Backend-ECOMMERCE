import { Router } from "express";
import {
    changePassword,
    getCurrentUser,
    loginUser,
    logoutUser,
    updateAccountDetails,
    checkStatus
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/user/verified-check' , verifyToken , checkStatus) ; // see that 
router.post("/login", loginUser);
router.post("/logout", verifyToken, logoutUser);
router.post("/change-password", verifyToken, changePassword);
router.get("/current-user", verifyToken, getCurrentUser);
router.patch("/update-account", verifyToken, updateAccountDetails);

export default router;

