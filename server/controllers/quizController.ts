import { Request, Response } from "express";
import QuizResult from "../models/QuizResult";
import { AuthRequest } from "../middleware/auth";

export const submitResult = async (req: AuthRequest, res: Response) => {
  try {
    const { score, totalQuestions, chapter, difficulty } = req.body;
    const userId = req.user?.id;

    const result = new QuizResult({
      userId,
      score,
      totalQuestions,
      chapter,
      difficulty,
    });

    await result.save();
    res.json({ message: "Result saved successfully", result });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
