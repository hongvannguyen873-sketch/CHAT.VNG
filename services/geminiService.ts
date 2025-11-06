
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { AspectRatio } from '../types';

let ai: GoogleGenAI | null = null;

const getAI = () => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

export const createChatSession = (modelName: 'gemini-2.5-flash' | 'gemini-2.5-flash-lite'): Chat => {
    const aiInstance = getAI();
    return aiInstance.chats.create({
        model: modelName,
    });
};

export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
    try {
        const aiInstance = getAI();
        const response = await aiInstance.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        throw new Error("No image was generated.");
    } catch (error) {
        console.error("Image generation failed:", error);
        throw new Error("Failed to generate image. Please check the console for details.");
    }
};

export const generateWithThinking = async (prompt: string): Promise<string> => {
    try {
        const aiInstance = getAI();
        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 32768 },
            },
        });
        return response.text;
    } catch (error) {
        console.error("Thinking mode generation failed:", error);
        throw new Error("Failed to generate response in thinking mode. Please check the console for details.");
    }
};
