import express from "express";
import { login, logout, register, adminRegister } from "../controllers/userAuth.js";
import userMiddleware from "../middleware/userMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", userMiddleware, logout);
authRouter.post("/admin/register", adminMiddleware, adminRegister);

authRouter.get("/check", userMiddleware, (req, res) => {
    const reply = {
        username: req.user.username,
        emailId: req.user.emailId,
        _id: req.user._id,
        role:req.user.role

    };

    res.status(200).json({
        user: reply,
        msg: "Valid user"
    });
});

export default authRouter;