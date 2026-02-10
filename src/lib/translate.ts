import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

/**
 * Translates text using Google Gemini AI.
 * @param text The text to translate
 * @param targetLanguage The target language (e.g., 'English', 'Indonesian')
 * @returns The translated text
 */
export async function translateText(text: string, targetLanguage: string = 'English'): Promise<string> {
    if (!text || text.trim() === '') return '';
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
        throw new Error('GOOGLE_GEMINI_API_KEY is not configured');
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
            You are a professional translator for Universitas Al-Irsyad Cilacap (UNAIC).
            Translate the following text into ${targetLanguage}.
            Maintain the original tone (academic but friendly), formatting, and HTML tags if present.
            Only return the translated text, nothing else.

            TEXT TO TRANSLATE:
            "${text}"
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let translated = response.text().trim();

        // Remove wrapping quotes if AI included them
        if (translated.startsWith('"') && translated.endsWith('"')) {
            translated = translated.substring(1, translated.length - 1);
        }

        return translated;
    } catch (error) {
        console.error('Translation Error:', error);
        throw error;
    }
}
