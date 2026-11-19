import express from "express";
import { Router } from "express";
import { createProblem, updateProblem, deleteProblem, fetchProblem, allProblems, solvedProblems } from "../controllers/userProblem.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import userMiddleware from "../middleware/userMiddleware.js";

const problemRouter = express.Router();

problemRouter.post("/create", adminMiddleware, createProblem);
problemRouter.put("/:id", adminMiddleware, updateProblem);
problemRouter.delete("/:id", adminMiddleware, deleteProblem);

problemRouter.get("/getAllProblem", allProblems);
problemRouter.get("/problemSolvedByUser", userMiddleware, solvedProblems);
problemRouter.get("/", allProblems);
problemRouter.get("/:id", fetchProblem);

export default problemRouter;
