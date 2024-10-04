import { Router } from "express";
import { registerUserRequest, otpverification } from "../controllers/user.controller.js";




const router = Router();

router.post('/' , registerUserRequest) ; 
router.post('/verifyOtp' , otpverification)

export default router ; 