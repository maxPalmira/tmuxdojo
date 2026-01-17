
import { GoogleGenAI } from "@google/genai";

// Always initialize a new GoogleGenAI instance inside the function to ensure the correct context.
export async function getTutorFeedback(currentLevel: string, userAction: string, success: boolean) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User is learning tmux. 
        Level: ${currentLevel}. 
        Action attempted: ${userAction}. 
        Success: ${success}.
        Give a very short, encouraging terminal-style feedback (max 15 words). 
        If failed, give a hint in terminal slang.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return success ? "Good job! Next level awaits." : "Almost! Try the shortcut again.";
  }
}
