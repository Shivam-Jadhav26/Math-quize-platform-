import express from "express";
import { getPerformance } from "../controllers/userController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/performance", authMiddleware, getPerformance);

export default router;
