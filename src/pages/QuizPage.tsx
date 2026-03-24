import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  BrainCircuit
} from "lucide-react";
import { api } from "../lib/api";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI, Type } from "@google/genai";

export default function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { chapter, difficulty, count } = location.state || {};

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!chapter) {
      navigate("/quiz-setup");
      return;
    }

    const generateQuizAI = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
        const model = "gemini-3-flash-preview";
        const prompt = `Generate a Mathematics quiz for Maharashtra State Board Class 10 (SSC). 
        Chapter: ${chapter}
        Difficulty: ${difficulty}
        Number of Questions: ${count}
        
        Requirements:
        - Strictly follow the Maharashtra SSC syllabus.
        - Questions should be multiple choice (MCQ).
        - Return a JSON array of objects.
        - Each object must have:
          - question: string
          - options: array of 4 strings
          - correctAnswer: number (0-3 index)
          - explanation: string (short explanation)
        
        Ensure the questions are accurate and relevant to the board exams.`;

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
                required: ["question", "options", "correctAnswer", "explanation"],
              },
            },
          },
        });

        const quizData = JSON.parse(response.text || "[]");
        
        if (!Array.isArray(quizData) || quizData.length === 0) {
          throw new Error("Invalid AI response");
        }

        setQuestions(quizData);
        setAnswers(new Array(quizData.length).fill(-1));
        setTimeLeft(quizData.length * 90); // 1.5 minutes per question
        setLoading(false);
      } catch (err) {
        console.error("Quiz generation error:", err);
        alert("Failed to generate quiz. Please try again.");
        navigate("/quiz-setup");
      }
    };

    generateQuizAI();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [chapter, difficulty, count, navigate]);

  useEffect(() => {
    if (!loading && timeLeft > 0 && !isSubmitting) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [loading, timeLeft, isSubmitting]);

  const handleAnswer = (optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optionIdx;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });

    try {
      await api.quiz.submit({
        score,
        totalQuestions: questions.length,
        chapter,
        difficulty
      });
      navigate("/result", { state: { score, questions, answers, chapter, difficulty } });
    } catch (err) {
      console.error(err);
      alert("Failed to submit quiz. Please try again.");
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-6"
        >
          <BrainCircuit className="w-16 h-16 text-indigo-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">AI is Generating Your Quiz...</h2>
        <p className="text-slate-500">Creating unique questions for {chapter}</p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No Questions Found</h2>
        <p className="text-slate-500 mb-6">We couldn't generate questions for this chapter. Please try again.</p>
        <button 
          onClick={() => navigate("/quiz-setup")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold">
            {currentIdx + 1}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base truncate max-w-[150px] sm:max-w-xs">{chapter}</h3>
            <p className="text-xs text-slate-400">{difficulty} • {questions.length} Questions</p>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold ${timeLeft < 60 ? "bg-red-50 text-red-600 animate-pulse" : "bg-slate-50 text-slate-700"}`}>
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-indigo-600"
        />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
            {currentQuestion.question}
          </h2>

          <div className="grid gap-4">
            {currentQuestion.options.map((option: string, i: number) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`p-5 rounded-2xl text-left font-semibold transition-all border-2 flex items-center justify-between group ${
                  answers[currentIdx] === i 
                    ? "bg-indigo-50 border-indigo-600 text-indigo-700" 
                    : "bg-white border-slate-100 hover:border-indigo-200 text-slate-600"
                }`}
              >
                <span>{option}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  answers[currentIdx] === i ? "border-indigo-600 bg-indigo-600" : "border-slate-200 group-hover:border-indigo-300"
                }`}>
                  {answers[currentIdx] === i && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx(prev => prev - 1)}
          className="flex items-center gap-2 px-6 py-3 font-bold text-slate-500 hover:text-indigo-600 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        {currentIdx === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Quiz"}
          </button>
        ) : (
          <button
            onClick={() => setCurrentIdx(prev => prev + 1)}
            className="flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
