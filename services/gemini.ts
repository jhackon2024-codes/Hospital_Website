import { GoogleGenAI, Chat } from "@google/genai";

let chatSession: Chat | null = null;

const getAIClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const initializeChat = async () => {
  const ai = getAIClient();
  if (!ai) return null;

  try {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are City General Hospital's Virtual Assistant. Your goal is to help visitors navigate the hospital website, find departments, understand general medical services, and book appointments. You are polite, professional, and empathetic. DISCLAIMER: Always remind users that you are an AI and they should consult a real doctor for medical diagnoses or emergencies. If they mention severe symptoms (chest pain, trouble breathing), tell them to call 911 immediately. Keep responses concise and helpful.",
      },
    });
    return chatSession;
  } catch (error) {
    console.error("Failed to initialize chat:", error);
    return null;
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    await initializeChat();
  }

  if (!chatSession) {
    return "I'm sorry, I am currently unavailable. Please try again later.";
  }

  try {
    const result = await chatSession.sendMessage({ message });
    return result.text || "I didn't understand that. Could you rephrase?";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "I encountered an error processing your request. Please try again.";
  }
};
