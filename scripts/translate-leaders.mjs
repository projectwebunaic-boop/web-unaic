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

const LEADERS_PATH = path.join(process.cwd(), 'src/data/leaders.json');

async function translate(text) {
    if (!text || typeof text !== 'string' || text.trim() === '') return text;

    const prompt = `
        You are a professional translator for Universitas Al-Irsyad Cilacap (UNAIC).
        Translate the following Indonesian text into English.
        Maintain original tone and formatting.
        Only return the translated text.

        TEXT:
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

async function translateList(list) {
    if (!list || !Array.isArray(list)) return list;
    return await Promise.all(list.map(item => translate(item)));
}

async function run() {
    console.log('Translating leaders.json...');

    if (!fs.existsSync(LEADERS_PATH)) {
        console.error('leaders.json not found');
        return;
    }

    const leaders = JSON.parse(fs.readFileSync(LEADERS_PATH, 'utf-8'));

    const translatedLeaders = await Promise.all(leaders.map(async (l) => {
        console.log(`Translating: ${l.name}`);
        return {
            ...l,
            titleEn: await translate(l.title),
            visionEn: l.vision ? await translate(l.vision) : undefined,
            educationEn: await translateList(l.education),
            careerEn: await translateList(l.career),
            researchEn: await translateList(l.research)
        };
    }));

    fs.writeFileSync(LEADERS_PATH, JSON.stringify(translatedLeaders, null, 2));
    console.log('Translation complete!');
}

run();
