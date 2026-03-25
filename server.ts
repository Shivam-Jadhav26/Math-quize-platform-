import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./server/routes/auth";
import quizRoutes from "./server/routes/quiz";
import userRoutes from "./server/routes/user";

dotenv.config();

const app = express();

// MongoDB Connection with caching for serverless
let isConnected = false;
async function connectToDatabase() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.warn("MONGODB_URI not found in environment variables. Using default.");
  }
  
  const uri = MONGODB_URI || "mongodb://localhost:27017/quiz-platform";
  
  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

// Middleware to ensure DB connection for every request
app.use(async (req, res, next) => {
  if (req.path.startsWith("/api")) {
    await connectToDatabase();
  }
  next();
});

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/user", userRoutes);

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const setupVite = async () => {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  };
  setupVite();

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} else {
  // In production (e.g., Vercel), we serve static files if needed,
  // but Vercel usually handles this via its own routing.
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  
  // Only add catch-all if not handled by Vercel's vercel.json
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}

export default app;
