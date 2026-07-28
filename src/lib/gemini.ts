import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini client.
// It automatically picks up GEMINI_API_KEY from the environment.
export const ai = new GoogleGenAI({});

export const DEFAULT_MODEL = 'gemini-2.5-flash';
