import express from "express"
import { userSubmission } from "../controllers/submitCode.js"
import userMiddleware from  "../middleware/userMiddleware.js"

const submitRouter=express.Router();



submitRouter.post("/:id",userMiddleware,userSubmission);
