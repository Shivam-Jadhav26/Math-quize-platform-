import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  RefreshCw, 
  LayoutDashboard,
  Info,
  PartyPopper
} from "lucide-react";
import confetti from "canvas-confetti";
import { motion } from "motion/react";

export default function Result() {
  const location = useLocation();
  const { score, questions, answers, chapter, difficulty } = location.state || {};

  useEffect(() => {
    if (score !== undefined && questions !== undefined) {
      const percentage = (score / questions.length) * 100;
      if (percentage >= 80) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#4f46e5", "#818cf8", "#c7d2fe"]
        });
      }
    }
  }, [score, questions]);

  if (score === undefined || !questions) return <div className="text-center py-12">No results found.</div>;

  const percentage = Math.round((score / questions.length) * 100);
  
  const getMotivationalMessage = () => {
    if (percentage === 100) return "Perfect Score! You're a Math Wizard! 🧙‍♂️";
    if (percentage >= 80) return "Excellent Work! You've mastered this chapter! 🌟";
    if (percentage >= 60) return "Good Job! Keep practicing to reach the top! 👍";
    return "Keep Going! Every mistake is a learning opportunity. 💪";
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Score Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 text-center mb-12 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" />
        
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
          <Trophy className="w-12 h-12" />
        </div>
        
        <h1 className="text-4xl font-black text-slate-800 mb-2">Quiz Completed!</h1>
        <p className="text-slate-500 font-medium mb-8">{chapter} • {difficulty}</p>
        
        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="text-center">
            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Score</p>
            <p className="text-5xl font-black text-slate-900">{score}<span className="text-2xl text-slate-300">/{questions.length}</span></p>
          </div>
          <div className="w-px h-16 bg-slate-100" />
          <div className="text-center">
            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Accuracy</p>
            <p className="text-5xl font-black text-indigo-600">{percentage}%</p>
          </div>
        </div>

        <div className="p-4 bg-indigo-50 rounded-2xl inline-flex items-center gap-2 text-indigo-700 font-bold mb-10">
          <PartyPopper className="w-5 h-5" />
          {getMotivationalMessage()}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/quiz-setup" className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Try Another Quiz
          </Link>
          <Link to="/dashboard" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5" />
            Go to Dashboard
          </Link>
        </div>
      </motion.div>

      {/* Review Section */}
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Info className="w-6 h-6 text-indigo-600" />
        Review Your Answers
      </h2>

      <div className="space-y-6">
        {questions.map((q: any, i: number) => {
          const isCorrect = answers[i] === q.correctAnswer;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl border-2 bg-white ${isCorrect ? "border-green-100" : "border-red-100"}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                  {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-4 leading-relaxed">{q.question}</h3>
                  
                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    {q.options.map((opt: string, optIdx: number) => (
                      <div 
                        key={optIdx}
                        className={`p-3 rounded-xl text-sm font-medium border ${
                          optIdx === q.correctAnswer ? "bg-green-50 border-green-200 text-green-700 font-bold" :
                          optIdx === answers[i] ? "bg-red-50 border-red-200 text-red-700 font-bold" :
                          "bg-slate-50 border-slate-100 text-slate-500"
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Explanation</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
