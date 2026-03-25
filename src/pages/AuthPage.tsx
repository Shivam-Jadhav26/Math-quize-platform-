import React, { useState } from "react";
import { User } from "../types";
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuthPageProps {
  setUser: (user: User | null) => void;
}

export default function AuthPage({ setUser }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Mock Auth for now (will integrate Firebase later)
    setTimeout(() => {
      if (isLogin) {
        if (email === "student@example.com" && password === "password") {
          const mockUser: User = { id: "1", name: "Demo Student", email, standard: "10th" };
          localStorage.setItem("user", JSON.stringify(mockUser));
          setUser(mockUser);
        } else {
          setError("Invalid credentials. Use student@example.com / password");
        }
      } else {
        const mockUser: User = { id: Date.now().toString(), name, email, standard: "10th" };
        localStorage.setItem("user", JSON.stringify(mockUser));
        setUser(mockUser);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto min-h-[70vh] flex flex-col justify-center space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-200">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">MahaMaths AI</h1>
          <p className="text-gray-500 font-medium">Maharashtra State Board Class 10 Prep</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-8">
        <div className="flex p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${isLogin ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${!isLogin ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <label className="text-sm font-bold text-gray-700">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100" />
          </div>
          <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
            <span className="bg-white px-4 text-gray-400">Or continue with</span>
          </div>
        </div>

        <button
          className="w-full py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Google Account
        </button>
      </div>

      <p className="text-center text-sm text-gray-500">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-indigo-600 font-bold hover:underline"
        >
          {isLogin ? "Register now" : "Sign in here"}
        </button>
      </p>
    </div>
  );
}
