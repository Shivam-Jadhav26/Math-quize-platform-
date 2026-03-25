import React from "react";
import { QuizResult } from "../types";
import { Clock, Award, ChevronRight } from "lucide-react";

interface QuizHistoryProps {
  results: QuizResult[];
}

export default function QuizHistory({ results }: QuizHistoryProps) {
  if (results.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center space-y-2">
        <p className="text-gray-500 font-medium">No quizzes taken yet.</p>
        <p className="text-sm text-gray-400">Your performance history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((result) => (
        <div
          key={result.id}
          className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between hover:border-indigo-200 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900">{result.chapter}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="capitalize">{result.difficulty}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(result.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-black text-indigo-600 text-lg">
                {result.score}/{result.totalQuestions}
              </p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Score</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 transition-colors" />
          </div>
        </div>
      ))}
    </div>
  );
}
