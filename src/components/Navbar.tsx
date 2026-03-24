import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, LogOut, User as UserIcon, LayoutDashboard, BrainCircuit } from "lucide-react";

interface NavbarProps {
  user: any;
  logout: () => void;
}

export default function Navbar({ user, logout }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-700 transition-colors">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">MahaMaths AI</span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link to="/quiz-setup" className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                <BookOpen className="w-4 h-4" />
                <span>New Quiz</span>
              </Link>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 hidden sm:block">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                Login
              </Link>
              <Link to="/register" className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
