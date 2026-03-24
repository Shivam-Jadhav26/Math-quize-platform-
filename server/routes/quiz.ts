import express from "express";
import { submitResult } from "../controllers/quizController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/submit", authMiddleware, submitResult);

export default router;
