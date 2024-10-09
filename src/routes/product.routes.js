import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  getAllProducts,
  publishAProduct,
  getProductById,
  deleteProduct,
  updateProduct,
  togglePublishStatus,
} from "../controllers/product.controller.js";
import { Product } from "../models/product.model.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

// router.use(verifyToken); // Apply verifyJWT middleware to all routes in this file

router
  .route("/")
  .get(getAllProducts) //hasRequiredRightmoDEL({method: GET , models: PRODUCT, CUSTOM: FAV}
  .post(verifyToken , upload.fields([
    {
      name :  'images' , 
      maxCount : 10 , 
    }
  ]) , publishAProduct);

router
  .route("/:productId")
  .get(getProductById)
  .delete(verifyToken , deleteProduct)
  .patch(verifyToken , upload.single("thumbnail"), updateProduct);

router.route("/toggle/publish/:productId").patch(togglePublishStatus); // change

export default router;
