import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  chapter: { type: String, required: true },
  difficulty: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("QuizResult", quizResultSchema);
