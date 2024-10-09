import express from "express";
const router = express.Router();
import userRoutes from "./user.routes.js";
import categoryRoutes from "./category.routes.js";
import productRoutes from "./product.routes.js";
import userRequestRoutes from "./userrequest.routes.js";
const routes = [
    {
        path: "/um",
        router: userRoutes,
    },
    {
        path: "/um/user-request",
        router: userRequestRoutes,
    },
    {
        path: "/pm/category",
        router: categoryRoutes,
    },
    {
        path: "/pm/product",
        router: productRoutes,
    },
    //not found route
];

routes.forEach((route) => {
    router.use(route.path, route.router);
});

export default router;
