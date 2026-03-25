import React, { useState, useEffect } from "react";
import { User, QuizResult } from "../types";
import { CHAPTERS, DIFFICULTIES } from "../constants";
import { useNavigate } from "react-router-dom";
import { Play, TrendingUp, Award, Clock } from "lucide-react";
import { motion } from "motion/react";
import QuizHistory from "../components/QuizHistory";

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const navigate = useNavigate();
  const [selectedChapter, setSelectedChapter] = useState(CHAPTERS[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTIES[0]);
  const [results, setResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    const storedResults = localStorage.getItem("quizResults");
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    } else {
      // Mock some initial results
      const mockResults: QuizResult[] = [
        { id: "1", userId: user.id, score: 4, totalQuestions: 5, chapter: "Linear Equations in Two Variables", difficulty: "Medium", timestamp: new Date(Date.now() - 86400000).toISOString() },
        { id: "2", userId: user.id, score: 3, totalQuestions: 5, chapter: "Quadratic Equations", difficulty: "Hard", timestamp: new Date(Date.now() - 172800000).toISOString() },
      ];
      setResults(mockResults);
      localStorage.setItem("quizResults", JSON.stringify(mockResults));
    }
  }, [user.id]);

  const startQuiz = () => {
    navigate(`/quiz/${encodeURIComponent(selectedChapter)}/${selectedDifficulty}`);
  };

  const averageScore = results.length > 0 
    ? Math.round((results.reduce((acc, r) => acc + (r.score / r.totalQuestions), 0) / results.length) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-500">Ready to master Class 10 Mathematics?</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Average Score</p>
              <p className="text-lg font-bold text-gray-900">{averageScore}%</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Quizzes Done</p>
              <p className="text-lg font-bold text-gray-900">{results.length}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Play className="w-5 h-5 text-indigo-600" />
              Start a New Quiz
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Select Chapter</label>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  {CHAPTERS.map((chapter) => (
                    <option key={chapter} value={chapter}>{chapter}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Select Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  {DIFFICULTIES.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              Generate AI Quiz
            </button>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <QuizHistory results={results} />
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl text-white space-y-4">
            <h3 className="font-bold text-lg">AI Study Tip</h3>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Focus on "Quadratic Equations" this week. Students who practice this chapter daily see a 20% improvement in their Geometry scores.
            </p>
            <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all">
              View Study Plan
            </button>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-900">Syllabus Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Algebra</span>
                  <span className="font-bold text-gray-900">75%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-3/4" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Geometry</span>
                  <span className="font-bold text-gray-900">40%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-2/5" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
