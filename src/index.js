import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import routes from "./routes/index.js";
import mongoose from "mongoose";
import { DB_NAME } from "./config/constants.js";
import morgan from "morgan";

const app = express();
dotenv.config({
    path: "./.env",
});
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 10 minutes
    limit: 1000,
    standardHeaders: "draft-7",
    legacyHeaders: false,
});

//middlewares
app.use(morgan("common"));
const allowedOrigins = process.env.CORS_ORIGIN.split(',');
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);
app.use(express.json({ limit: "50mb" }));
app.use(urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(limiter);
app.use(routes); //using routes

// Data-Base Connection .
const DB_CONNECT = async () => {
    try {
        const instanceConnection = await mongoose.connect(
            `${process.env.DB_URI}/${DB_NAME}`
        );
        console.log(
            "DB Connected SucessFully ",
            instanceConnection.connection.host
        );
    } catch (err) {
        console.log("Mongo connection failed", err);
        process.exit(1);
    }
};

const PORT = process.env.PORT || 8000;
DB_CONNECT()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server Connected at ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("Error occured in DB Connection", err);
    });
