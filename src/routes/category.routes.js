import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    createCategory,
    getCategories,
} from "../controllers/category.controller.js";

const router = Router();

router.use(verifyToken); // Apply verifyJWT middleware to all routes in this file

router.route("/add-category").post(createCategory);
router.route("/get-category").get(getCategories);

export default router;
