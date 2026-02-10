
import fs from 'fs';
import path from 'path';
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
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Fields to translate (add more if needed)
const TRANSLATABLE_FIELDS = [
    'title', 'description', 'subtitle', 'content', 'welcomePrefix',
    'label', 'name', 'testimonial', 'position', 'graduation', 'story'
];

// Helper to check if a field needs translation
function needsTranslation(obj, key) {
    const enKey = key + 'En';
    // Check if the field is in our list, has a value, and the En version is missing/empty
    return TRANSLATABLE_FIELDS.includes(key) &&
        typeof obj[key] === 'string' &&
        obj[key].trim() !== '' &&
        (!obj[enKey] || obj[enKey].trim() === '');
}

// Recursive function to traverse and translate object
async function translateObject(obj, pathStack = []) {
    if (!obj || typeof obj !== 'object') return;

    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            // console.log(`Processing array item ${i}...`);
            await translateObject(obj[i], [...pathStack, `[${i}]`]);
        }
        return;
    }

    // Collect keys that need translation for this object
    const keysToTranslate = [];
    for (const key of Object.keys(obj)) {
        if (needsTranslation(obj, key)) {
            keysToTranslate.push(key);
        } else if (typeof obj[key] === 'object') {
            await translateObject(obj[key], [...pathStack, key]);
        }
    }

    if (keysToTranslate.length > 0) {
        console.log(`Translating fields in ${pathStack.join('.')}: ${keysToTranslate.join(', ')}`);

        // Construct prompt
        const prompt = `Translate the following Indonesian text to English. Return ONLY a JSON object with keys: ${keysToTranslate.map(k => `"${k}En"`).join(', ')}.
    
    Source texts:
    ${JSON.stringify(keysToTranslate.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {}), null, 2)}
    
    IMPORTANT: Return RAW JSON only. No markdown formatting.`;

        try {
            // Simple retry logic for 429
            let result;
            try {
                result = await model.generateContent(prompt);
            } catch (e) {
                if (e.message.includes('429')) {
                    console.log(`    ! Rate limit hit. Waiting 60s before retry...`);
                    await new Promise(resolve => setTimeout(resolve, 60000));
                    result = await model.generateContent(prompt);
                } else {
                    throw e;
                }
            }

            const responseText = result.response.text();
            // Clean up markdown code blocks if any
            const jsonStr = responseText.replace(/```json\n?|\n?```/g, '').trim();
            const translations = JSON.parse(jsonStr);

            // Apply translations
            for (const [key, value] of Object.entries(translations)) {
                if (value && typeof value === 'string') {
                    // Ensure we are setting the En key
                    // The API might return "titleEn" or just "title" depending on prompt strictness handling
                    // My prompt asked for "titleEn", so hopefully it returns that.
                    // Let's robustly handle if it returns "title" instead of "titleEn"
                    let targetKey = key;
                    if (!targetKey.endsWith('En') && keysToTranslate.includes(targetKey)) {
                        targetKey = targetKey + 'En';
                    }
                    if (!targetKey.endsWith('En')) {
                        // If the key returned doesn't match a target En key, try to match it to a source key
                        const sourceKey = keysToTranslate.find(k => k + 'En' === targetKey);
                        if (sourceKey) targetKey = sourceKey + 'En';
                    }

                    if (targetKey.endsWith('En')) {
                        obj[targetKey] = value;
                        console.log(`  ✓ ${targetKey}: ${value.substring(0, 50)}...`);
                    }
                }
            }
        } catch (error) {
            console.error(`  ✗ Failed to translate ${pathStack.join('.')}:`, error.message);
        }

        // Rate limiting / pause to avoid hitting limits too fast
        await new Promise(resolve => setTimeout(resolve, 10000));
    }
}

async function processFile(filePath) {
    try {
        const fullPath = path.resolve(filePath);
        console.log(`\nProcessing ${fullPath}...`);

        if (!fs.existsSync(fullPath)) {
            console.error(`File not found: ${fullPath}`);
            return;
        }

        const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

        await translateObject(data);

        fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Done! Saved updates to ${fullPath}`);
    } catch (e) {
        console.error(`Error processing file ${filePath}:`, e);
    }
}

// Main execution
const files = process.argv.slice(2);
if (files.length === 0) {
    console.log("Usage: node scripts/bulk-translate-json.mjs <file1.json> <file2.json> ...");
    console.log("Example: node scripts/bulk-translate-json.mjs src/data/homepage.json");
} else {
    (async () => {
        for (const file of files) {
            await processFile(file);
        }
    })();
}
