import { Router } from "express";
import {
    changePassword,
    getCurrentUser,
    loginUser,
    logoutUser,
    updateAccountDetails,
    checkStatus,
    deleteAccount,
    getDetails,
    refreshAccessToken
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/verified-check", verifyToken, checkStatus); // see that
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", verifyToken, logoutUser);
router.post("/change-password", verifyToken, changePassword);
router.get("/current-user", verifyToken, getCurrentUser);
router.delete("/delete-account", verifyToken, deleteAccount);
router.patch("/update-account", verifyToken, updateAccountDetails);
router.get("/get-details" , verifyToken , getDetails )

export default router;
