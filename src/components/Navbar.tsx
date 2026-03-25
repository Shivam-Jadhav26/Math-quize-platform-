import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../types";
import { LogOut, BookOpen, User as UserIcon } from "lucide-react";

interface NavbarProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export default function Navbar({ user, setUser }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/auth");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <BookOpen className="w-6 h-6" />
          <span>MahaMaths AI</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-600">
              <UserIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
