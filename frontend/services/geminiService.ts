import { GoogleGenAI } from "@google/genai";
import { Project } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStudyGuide = async (project: Project): Promise<string> => {
  try {
    const prompt = `
      You are a senior coding instructor. Create a concise, markdown-formatted study guide for a student about to download this project.
      
      Project Title: ${project.title}
      Language: ${project.language}
      Difficulty: ${project.difficulty}
      Description: ${project.description}
      File Structure:
      ${project.fileStructure}

      Please provide:
      1. Key Concepts they will learn.
      2. A specific "Code to look for" section based on the file structure.
      3. One challenge/modification they should try to implement after downloading.
      
      Keep it encouraging and technical.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Unable to generate study guide at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to the AI tutor. Please try again later.";
  }
};

export const explainCommand = async (command: string): Promise<string> => {
  try {
      const prompt = `Explain this CLI command to a beginner student in one short sentence: \`${command}\``;
       const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || "Downloads the file.";
  } catch (e) {
      return "Downloads the source code to your local machine.";
  }
}
