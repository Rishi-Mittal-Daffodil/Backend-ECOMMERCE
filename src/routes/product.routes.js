import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    verifyAdmin,
    validateProduct,
} from "../middlewares/validate.middleware.js";
import {
    getAllProducts,
    publishAProduct,
    getProductById,
    deleteProduct,
    updateProduct,
    togglePublishStatus,
    getProductsByQuery,
    searchProducts,
} from "../controllers/product.controller.js";
import { Product } from "../models/product.model.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();


router.route("/search").get(searchProducts);
router
    .route("/") //hasRequiredRightmoDEL({method: GET , models: PRODUCT, CUSTOM: FAV}
    .post(
        verifyToken,
        verifyAdmin,
        validateProduct,
        upload.fields([
            {
                name: "images",
                maxCount: 10,
            },
        ]),
        publishAProduct
    )
    .get(getProductsByQuery);

router.get("/get-all-products", getAllProducts);

router
    .route("/:productId")
    .get(getProductById)
    .delete(verifyToken, verifyAdmin, deleteProduct)
    .patch(verifyToken, verifyAdmin,validateProduct , updateProduct);

router.route("/toggle/publish/:productId").patch(togglePublishStatus); // change

export default router;
