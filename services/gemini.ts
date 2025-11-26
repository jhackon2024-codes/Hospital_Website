
import { GoogleGenAI, Chat, Modality } from "@google/genai";
import { ChatSettings, AspectRatio, ImageSize, Attachment } from "../types";
import { DOCTORS, SERVICES } from "../constants";

// Ensure we have a valid client.
const getClient = async (requireUserKey = false) => {
  let apiKey = process.env.API_KEY;

  if (requireUserKey && (window as any).aistudio) {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }
  }
  
  return new GoogleGenAI({ apiKey: apiKey });
};

// --- Chat Service ---

let chatSession: Chat | null = null;
let currentConfig: ChatSettings | null = null;

const getHospitalContext = () => {
  const doctorsList = DOCTORS.map(d => `${d.name} (${d.specialty}) - Available: ${d.availability.join(', ')}`).join('\n');
  const servicesList = SERVICES.map(s => s.title).join(', ');
  
  return `
    Hospital Data:
    Services: ${servicesList}
    Doctors:
    ${doctorsList}
  `;
};

const getLocation = (): Promise<{latitude: number, longitude: number} | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.warn("Geolocation denied or failed", error);
        resolve(null);
      }
    );
  });
};

export const initializeChat = async (settings: ChatSettings) => {
  const ai = await getClient();
  
  let modelName = 'gemini-3-pro-preview';
  if (settings.model === 'flash') modelName = 'gemini-2.5-flash';
  if (settings.model === 'flash-lite') modelName = 'gemini-2.5-flash-lite-latest';

  // Tools configuration
  const tools: any[] = [];
  let toolConfig: any = undefined;

  // Add Maps with Location if enabled
  if (settings.enableMaps && modelName !== 'gemini-2.5-flash-lite-latest') {
    tools.push({ googleMaps: {} });
    
    // Try to get location for better maps grounding
    const location = await getLocation();
    if (location) {
      toolConfig = {
        retrievalConfig: {
          latLng: location
        }
      };
    }
  }

  if (settings.enableSearch && modelName !== 'gemini-2.5-flash-lite-latest') {
    tools.push({ googleSearch: {} });
  }

  // Config
  const generationConfig: any = {
    systemInstruction: `You are City General Hospital's Advanced AI Assistant. 
    You help with medical info (always include disclaimers), navigation, and appointments. 
    You have access to the following hospital info:
    ${getHospitalContext()}
    
    When asked about doctors or services, strictly use the provided list. 
    If asked about general medical queries, provide professional information but advise seeing a doctor.
    You are helpful, professional, and empathetic.`,
    tools: tools.length > 0 ? tools : undefined,
    toolConfig: toolConfig
  };

  // Thinking Config (Only for Pro)
  if (settings.enableThinking && modelName === 'gemini-3-pro-preview') {
    generationConfig.thinkingConfig = { thinkingBudget: 32768 };
    // Do not set maxOutputTokens when using thinking
  }

  try {
    chatSession = ai.chats.create({
      model: modelName,
      config: generationConfig,
    });
    currentConfig = settings;
    return chatSession;
  } catch (error) {
    console.error("Failed to initialize chat:", error);
    return null;
  }
};

export const sendMessage = async (
  text: string, 
  attachments: Attachment[] = [],
  settings: ChatSettings
) => {
  // Re-initialize if settings changed significantly or no session
  if (!chatSession || JSON.stringify(currentConfig) !== JSON.stringify(settings)) {
    await initializeChat(settings);
  }
  
  if (!chatSession) throw new Error("Chat could not be initialized");

  try {
    let messageInput: any;

    if (attachments.length === 0) {
      messageInput = { text };
    } else {
      const parts = attachments.map(att => ({
        inlineData: { data: att.data, mimeType: att.mimeType }
      }));
      parts.push({ text: text || "Analyze this." } as any);
      messageInput = { parts };
    }

    const response = await chatSession.sendMessage(messageInput);
    
    return {
      text: response.text,
      groundingMetadata: response.candidates?.[0]?.groundingMetadata,
    };
  } catch (error) {
    console.error("Message failed:", error);
    throw error;
  }
};

// --- Audio Services ---

export const transcribeAudio = async (base64Audio: string, mimeType: string) => {
  const ai = await getClient();
  // Using Flash for fast transcription as requested
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        { inlineData: { data: base64Audio, mimeType } },
        { text: "Transcribe this audio exactly as spoken." }
      ]
    }
  });
  return response.text || "";
};

export const generateSpeech = async (text: string) => {
  const ai = await getClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' }, 
        },
      },
    },
  });
  
  // Return base64 audio data
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

// --- Visual Generation Services ---

export const generateImage = async (
  prompt: string, 
  aspectRatio: AspectRatio = "1:1",
  size: ImageSize = "1K"
) => {
  // Requirement: User must select key for high-quality generation
  const ai = await getClient(true); 
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: size
      }
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

export const editImage = async (
  base64Image: string,
  prompt: string,
  mimeType: string = "image/png"
) => {
  // Nano banana powered app (Gemini 2.5 Flash Image)
  const ai = await getClient();
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType } },
        { text: prompt },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No edited image returned");
};

// --- Video Generation Services ---

export const generateVideo = async (
  prompt: string,
  inputImage?: { data: string; mimeType: string },
  aspectRatio: '16:9' | '9:16' = '16:9'
) => {
  // Requirement: User must select key for Veo
  const ai = await getClient(true); 
  
  // Use veo-3.1-fast-generate-preview as requested
  const model = 'veo-3.1-fast-generate-preview';
  
  let operation;
  
  const config = {
    numberOfVideos: 1,
    resolution: '720p',
    aspectRatio: aspectRatio
  };

  if (inputImage) {
    operation = await ai.models.generateVideos({
      model,
      prompt: prompt || "Animate this image",
      image: {
        imageBytes: inputImage.data,
        mimeType: inputImage.mimeType,
      },
      config
    });
  } else {
    operation = await ai.models.generateVideos({
      model,
      prompt,
      config
    });
  }

  // Poll for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error("Video generation failed");

  // Fetch the actual video bytes using the API Key
  const vidResponse = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
  const blob = await vidResponse.blob();
  return URL.createObjectURL(blob);
};
