import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Question, User } from "../types";
import { generateQuiz } from "../services/geminiService";
import { CheckCircle2, XCircle, ArrowRight, Loader2, Award, Home } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";

interface QuizPageProps {
  user: User;
}

export default function QuizPage({ user }: QuizPageProps) {
  const { chapter, difficulty } = useParams<{ chapter: string; difficulty: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (chapter && difficulty) {
        const quizQuestions = await generateQuiz(chapter, difficulty);
        setQuestions(quizQuestions);
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [chapter, difficulty]);

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizComplete(true);
      
      // Calculate final score correctly (including the last question)
      const finalScore = selectedOption === questions[currentQuestionIndex].correctAnswer ? score + 1 : score;
      
      // Save result
      const newResult = {
        id: Date.now().toString(),
        userId: user.id,
        score: finalScore,
        totalQuestions: questions.length,
        chapter: chapter || "",
        difficulty: difficulty || "",
        timestamp: new Date().toISOString()
      };
      
      const existingResults = JSON.parse(localStorage.getItem("quizResults") || "[]");
      localStorage.setItem("quizResults", JSON.stringify([newResult, ...existingResults]));

      if (finalScore >= questions.length * 0.8) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#4f46e5", "#818cf8", "#c7d2fe"]
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">AI is generating your custom quiz...</p>
      </div>
    );
  }

  if (quizComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center space-y-8"
      >
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
          <Award className="w-12 h-12 text-indigo-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Quiz Complete!</h2>
          <p className="text-gray-500">Great job on finishing the quiz.</p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-2xl">
          <p className="text-sm text-gray-400 uppercase font-bold tracking-widest mb-1">Final Score</p>
          <p className="text-5xl font-black text-indigo-600">{score} / {questions.length}</p>
          <p className="text-sm text-gray-500 mt-2">
            {score === questions.length ? "Perfect Score! 🌟" : score >= questions.length * 0.8 ? "Excellent Work! 👏" : "Keep Practicing! 💪"}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-lg font-bold text-gray-900">{chapter}</h1>
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{difficulty} Difficulty</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-indigo-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
          <div className="w-32 h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8"
      >
        <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
          {currentQuestion.question}
        </h2>

        <div className="grid gap-4">
          {currentQuestion.options.map((option, index) => {
            let bgColor = "bg-gray-50 hover:bg-gray-100 border-gray-100";
            let textColor = "text-gray-700";
            let icon = null;

            if (selectedOption === index) {
              bgColor = "bg-indigo-50 border-indigo-200 ring-2 ring-indigo-500";
              textColor = "text-indigo-900";
            }

            if (isAnswered) {
              if (index === currentQuestion.correctAnswer) {
                bgColor = "bg-emerald-50 border-emerald-200 ring-2 ring-emerald-500";
                textColor = "text-emerald-900";
                icon = <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
              } else if (selectedOption === index) {
                bgColor = "bg-red-50 border-red-200 ring-2 ring-red-500";
                textColor = "text-red-900";
                icon = <XCircle className="w-5 h-5 text-red-600" />;
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group ${bgColor}`}
              >
                <span className={`font-medium ${textColor}`}>{option}</span>
                {icon}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-indigo-50 rounded-2xl space-y-2"
            >
              <p className="text-sm font-bold text-indigo-900">Explanation</p>
              <p className="text-sm text-indigo-700 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-4">
          {!isAnswered ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-100"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
            >
              {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
