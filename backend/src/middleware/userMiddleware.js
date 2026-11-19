import jwt from "jsonwebtoken";
import userSchmea from "../models/userModel.js";
import redisClient from "../config/redis.js";

const jwtKey = process.env.jWT_kEY;

const userMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ msg: "Token has been revoked/expired" });
        }

        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked === 1) {
            return res.status(401).json({ msg: "Token has been revoked/expired" });
        }

        const payload = jwt.verify(token, jwtKey);

        const { emailId } = payload;
        if (!emailId) {
            return res.status(401).json({ msg: "Invalid token payload" });
        }

        const user = await userSchmea.findOne({ emailId });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        req.user = user;
        next();
    }
    catch (err) {
        console.log("Some error occurred in the middleware section:", err.message);
        return res.status(401).json({ msg: `Authentication failed: ${err.message}` });
    }
};

export default userMiddleware;