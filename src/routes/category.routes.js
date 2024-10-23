import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/validate.middleware.js";
import {
    createCategory,
    getCategories,
    getCategoriesByQueries,
} from "../controllers/category.controller.js";

const router = Router();

// router.use(verifyToken , verifyAdmin); // Apply verifyJWT middleware to all routes in this file

router.route("/add-category").post(verifyToken, verifyAdmin, createCategory);
router.route("/get-category").get(verifyToken, verifyAdmin, getCategories);
router.route("/search").get(getCategoriesByQueries);

export default router;
