export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResult {
  id: string;
  userId: string;
  score: number;
  totalQuestions: number;
  chapter: string;
  difficulty: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  standard: string;
}
