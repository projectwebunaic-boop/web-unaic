
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("Error: GOOGLE_GEMINI_API_KEY not found in .env or .env.local");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function testTranslation() {
    try {
        console.log("Testing Gemini API...");
        // Match the model used in src/lib/translate.ts
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        const prompt = "Translate 'Hello World' to Indonesian. Return only the text.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Success! Translated text:", text);
    } catch (error) {
        console.error("API Test Failed:", error.message);
        if (error.response) {
            console.error("Response:", JSON.stringify(error.response, null, 2));
        }
    }
}

testTranslation();
