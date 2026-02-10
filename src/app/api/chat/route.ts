import { NextRequest, NextResponse } from 'next/server';
import { getKnowledgeBase } from '@/lib/chatbot';
import Fuse from 'fuse.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

export async function GET() {
  const knowledgeBase = getKnowledgeBase();
  // Filter items that are active and marked as suggestions
  const suggestions = knowledgeBase
    .filter(item => item.isActive && item.isSuggestion)
    .map(item => item.topics[0] || "Info");

  return NextResponse.json(suggestions);
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    const knowledgeBase = getKnowledgeBase();

    // 1. LOCAL SEARCH (Fuse.js)
    // -----------------------------------------
    const options = {
      keys: ['keywords', 'topics', 'answer'],
      threshold: 0.4, // 0.0 = perfect match, 1.0 = match anything
      includeScore: true
    };

    const fuse = new Fuse(knowledgeBase.filter(k => k.isActive), options);
    const result = fuse.search(message);

    // If we have a good match (score < 0.4 usually means decent match)
    if (result.length > 0 && result[0].score! < 0.4) {
      return NextResponse.json({
        answer: result[0].item.answer,
        source: 'local'
      });
    }

    // 2. AI FALLBACK (Google Gemini)
    // -----------------------------------------
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json({
        answer: "Maaf, saya belum menemukan jawaban di database dan fitur AI belum dikonfigurasi.",
        source: 'system'
      });
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

      // Create a context-aware system prompt
      // We feed the local knowledge as "context" so AI knows the facts too
      const contextData = knowledgeBase
        .filter(k => k.isActive)
        .map(k => `Q: ${k.keywords.join(", ")}\nA: ${k.answer}`)
        .join("\n\n");

      const prompt = `
        Kamu adalah asisten virtual resmi dari Universitas Al-Irsyad Cilacap (UNAIC).
        
        Tugasmu:
        1. Jawab pertanyaan pengguna dengan sopan, ramah, dan bernada akademis namun santai.
        2. Gunakan Bahasa Indonesia yang baik.
        3. Jika pertanyaan terkait fakta kampus (biaya, prodi, alamat), gunakan data konteks di bawah ini.
        4. Jika pertanyaan di luar konteks kampus (misal: curhat, tanya kabar), jawablah secara umum tapi tetap profesional sebagai representasi kampus.
        5. Jangan mengarang data spesifik (seperti nominal biaya pasti) jika tidak ada di konteks. Arahkan ke website resmi atau kontak admin.

        KONTEKS DATA UNAIC:
        ${contextData}

        PERTANYAAN USER: "${message}"
        
        JAWABAN (Singkat & Jelas, max 3 paragraf):
      `;

      const resultAI = await model.generateContent(prompt);
      const response = await resultAI.response;
      const text = response.text();

      return NextResponse.json({
        answer: text,
        source: 'ai'
      });

    } catch (aiError) {
      console.error("Gemini Error:", aiError);
      return NextResponse.json({
        answer: "Maaf, saya sedang mengalami gangguan koneksi ke otak AI saya. Silakan coba lagi nanti atau hubungi Admin.",
        source: 'error'
      });
    }

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
