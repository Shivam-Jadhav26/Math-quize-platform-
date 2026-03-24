import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Settings2, Play, Brain, Sparkles } from "lucide-react";
import { CHAPTERS, DIFFICULTIES, QUESTION_COUNTS } from "../constants";
import { motion } from "motion/react";

export default function QuizSetup() {
  const [chapter, setChapter] = useState(CHAPTERS[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[1]);
  const [count, setCount] = useState(QUESTION_COUNTS[0]);
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/quiz", { state: { chapter, difficulty, count } });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Settings2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Quiz Setup</h1>
            <p className="text-slate-500">Customize your practice session</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Chapter Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Select Chapter
            </label>
            <select 
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer font-medium text-slate-700"
            >
              {CHAPTERS.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Difficulty Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-600" />
                Difficulty Level
              </label>
              <div className="flex flex-wrap gap-2">
                {DIFFICULTIES.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all border ${
                      difficulty === d 
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100" 
                        : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Number of Questions
              </label>
              <div className="flex flex-wrap gap-2">
                {QUESTION_COUNTS.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setCount(c)}
                    className={`w-12 h-12 rounded-xl font-bold text-sm transition-all border flex items-center justify-center ${
                      count === c 
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100" 
                        : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              onClick={handleStart}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 group"
            >
              Generate AI Quiz
              <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">
              Our AI will generate unique questions based on your selection.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
