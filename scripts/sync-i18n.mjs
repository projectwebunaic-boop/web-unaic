import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
if (!API_KEY) {
    console.error('Error: GOOGLE_GEMINI_API_KEY environment variable is not set.');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const ID_PATH = path.join(process.cwd(), 'messages/id.json');
const EN_PATH = path.join(process.cwd(), 'messages/en.json');

async function translate(text) {
    if (!text || typeof text !== 'string' || text.trim() === '') return text;

    const prompt = `
        You are a professional translator for Universitas Al-Irsyad Cilacap (UNAIC).
        Translate the following Indonesian text into English.
        Maintain the original tone (academic but friendly), formatting, and HTML tags if present.
        Only return the translated text, nothing else.

        TEXT TO TRANSLATE:
        "${text}"
    `;

    try {
        const result = await model.generateContent(prompt);
        let translated = result.response.text().trim();
        if (translated.startsWith('"') && translated.endsWith('"')) {
            translated = translated.substring(1, translated.length - 1);
        }
        return translated;
    } catch (e) {
        console.error(`Failed to translate: ${text}`, e);
        return text;
    }
}

async function syncObjects(source, target) {
    const updated = { ...target };

    for (const key in source) {
        if (typeof source[key] === 'object' && source[key] !== null) {
            updated[key] = await syncObjects(source[key], target[key] || {});
        } else if (!(key in target)) {
            console.log(`Translating new key: ${key}`);
            updated[key] = await translate(source[key]);
        }
    }

    return updated;
}

async function run() {
    console.log('Starting i18n synchronization...');

    if (!fs.existsSync(ID_PATH)) {
        console.error('id.json not found');
        return;
    }

    const idData = JSON.parse(fs.readFileSync(ID_PATH, 'utf-8'));
    const enData = fs.existsSync(EN_PATH) ? JSON.parse(fs.readFileSync(EN_PATH, 'utf-8')) : {};

    const updatedEnData = await syncObjects(idData, enData);

    fs.writeFileSync(EN_PATH, JSON.stringify(updatedEnData, null, 4));
    console.log('Synchronization complete! en.json updated.');
}

run();
