import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import main from "./config/db.js";
import redisClient from "./config/redis.js";
import authRouter from "./routes/userAuthentication.js";
import problemRouter from "./routes/problemCreator.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods:["PUT","POST","GET","DELETE","PATCH","OPTIONS"],
    allowedHeaders:["Content-Type","Authorization"]
}));



const PORT = process.env.PORT || 4700;

app.use("/user", authRouter);
app.use("/problem",problemRouter);



const initialiseConnection = async () => {
    try {
        await Promise.all([main(), redisClient.connect()]);
        console.log("successfully connected to the database");

        app.listen(PORT, () => {
            console.log(`Server listening on the port number ${PORT}`);
        });
    } catch (err) {
        console.error(`some error occured ${err.message}`);
    }
};

initialiseConnection();