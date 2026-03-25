import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateQuiz = async (chapter: string, difficulty: string): Promise<Question[]> => {
  const model = "gemini-3-flash-preview";
  const prompt = `Generate a 5-question multiple-choice quiz for Maharashtra State Board Class 10 Mathematics (Algebra/Geometry).
  Chapter: ${chapter}
  Difficulty: ${difficulty}
  Include questions that follow the board exam pattern.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
            explanation: { type: Type.STRING },
          },
          required: ["id", "question", "options", "correctAnswer", "explanation"],
        },
      },
    },
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Failed to parse quiz response:", error);
    return [];
  }
};
