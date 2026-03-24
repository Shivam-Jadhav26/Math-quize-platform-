import { Response } from "express";
import QuizResult from "../models/QuizResult";
import { AuthRequest } from "../middleware/auth";

export const getPerformance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const results = await QuizResult.find({ userId }).sort({ date: -1 });

    const totalQuizzes = results.length;
    const avgScore = totalQuizzes > 0 
      ? (results.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions), 0) / totalQuizzes) * 100 
      : 0;

    // Analysis of weak chapters (chapters with avg score < 60%)
    const chapterStats: { [key: string]: { total: number, correct: number } } = {};
    results.forEach(r => {
      if (!chapterStats[r.chapter]) chapterStats[r.chapter] = { total: 0, correct: 0 };
      chapterStats[r.chapter].total += r.totalQuestions;
      chapterStats[r.chapter].correct += r.score;
    });

    const weakChapters = Object.keys(chapterStats).filter(chapter => {
      const stats = chapterStats[chapter];
      return (stats.correct / stats.total) < 0.6;
    });

    res.json({
      totalQuizzes,
      avgScore: Math.round(avgScore),
      history: results.slice(0, 10), // Last 10 quizzes
      chartData: results.slice(0, 7).reverse().map(r => ({
        date: new Date(r.date).toLocaleDateString(),
        score: Math.round((r.score / r.totalQuestions) * 100)
      })),
      weakChapters
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
