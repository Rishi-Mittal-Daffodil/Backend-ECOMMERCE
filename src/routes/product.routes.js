import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  getAllProducts,
  publishAProduct,
  getProductById,
  deleteProduct,
  updateProduct,
  togglePublishStatus,
} from "../controllers/Product.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.use(verifyToken); // Apply verifyJWT middleware to all routes in this file

router
  .route("/")
  .get(getAllProducts)
  .post(upload.fields([
    {
      name :  'images' , 
      maxCount : 10 , 
    }
  ]) , publishAProduct);

router
  .route("/:productId")
  .get(getProductById)
  .delete(deleteProduct)
  .patch(upload.single("thumbnail"), updateProduct);

router.route("/toggle/publish/:productId").patch(togglePublishStatus);

export default router;
