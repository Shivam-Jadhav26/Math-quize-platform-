import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Trophy, 
  Target, 
  History, 
  AlertTriangle, 
  TrendingUp, 
  BookOpen, 
  ChevronRight,
  Clock
} from "lucide-react";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip as ChartTooltip, 
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";
import { api } from "../lib/api";
import { motion } from "motion/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.user.getPerformance()
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64">Loading Dashboard...</div>;

  const chartData = {
    labels: stats.chartData.map((d: any) => d.date),
    datasets: [
      {
        label: "Score (%)",
        data: stats.chartData.map((d: any) => d.score),
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        borderWidth: 3,
        pointBackgroundColor: "#4f46e5",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 12,
        titleFont: { size: 14, weight: "bold" as const },
        bodyFont: { size: 13 },
        cornerRadius: 12,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8", font: { size: 12 } },
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: "#f1f5f9" },
        ticks: { color: "#94a3b8", font: { size: 12 }, stepSize: 20 },
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Student Dashboard</h1>
          <p className="text-slate-500">Track your progress and excel in Mathematics</p>
        </div>
        <Link to="/quiz-setup" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Start New Quiz
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Quizzes Attempted", value: stats.totalQuizzes, icon: <History />, color: "bg-blue-50 text-blue-600" },
          { label: "Average Score", value: `${stats.avgScore}%`, icon: <Target />, color: "bg-green-50 text-green-600" },
          { label: "Weak Chapters", value: stats.weakChapters.length, icon: <AlertTriangle />, color: "bg-amber-50 text-amber-600" },
          { label: "Best Score", value: stats.history.length > 0 ? `${Math.max(...stats.history.map((h: any) => Math.round((h.score / h.totalQuestions) * 100)))}%` : "0%", icon: <Trophy />, color: "bg-indigo-50 text-indigo-600" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              {React.cloneElement(stat.icon as React.ReactElement, { className: "w-6 h-6" })}
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Performance Graph */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Performance Trend
            </h3>
            <span className="text-xs text-slate-500 font-medium">Last 7 Quizzes</span>
          </div>
          <div className="h-64 w-full">
            {stats.chartData.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 italic">No data available yet. Start a quiz!</div>
            )}
          </div>
        </div>

        {/* Weak Chapters */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Focus Areas
          </h3>
          <div className="space-y-4">
            {stats.weakChapters.length > 0 ? stats.weakChapters.map((chapter: string, i: number) => (
              <div key={i} className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-sm font-bold text-amber-800 mb-1">{chapter}</p>
                <div className="flex items-center justify-between text-xs text-amber-600">
                  <span>Needs Improvement</span>
                  <Link to="/quiz-setup" className="font-bold hover:underline flex items-center gap-1">
                    Practice <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6" />
                </div>
                <p className="text-sm text-slate-500">Great job! No weak chapters identified yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent History */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            Recent Quiz History
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-sm font-medium">
                  <th className="pb-4 pl-2">Chapter</th>
                  <th className="pb-4">Difficulty</th>
                  <th className="pb-4">Score</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stats.history.map((quiz: any, i: number) => (
                  <tr key={i} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4 pl-2 font-semibold text-slate-700">{quiz.chapter}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        quiz.difficulty === "Easy" ? "bg-green-100 text-green-700" :
                        quiz.difficulty === "Medium" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                      }`}>
                        {quiz.difficulty}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="font-bold text-slate-900">{quiz.score}</span>
                      <span className="text-slate-400 text-sm"> / {quiz.totalQuestions}</span>
                    </td>
                    <td className="py-4 text-slate-500 text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(quiz.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-right pr-2">
                      <button className="text-indigo-600 font-bold text-sm hover:underline">Details</button>
                    </td>
                  </tr>
                ))}
                {stats.history.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 italic">No quizzes attempted yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
