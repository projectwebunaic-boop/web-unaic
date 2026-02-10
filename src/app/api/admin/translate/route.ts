import { NextRequest, NextResponse } from 'next/server';
import { translateText } from '@/lib/translate';

export async function POST(req: NextRequest) {
    try {
        const { text, targetLanguage } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const translated = await translateText(text, targetLanguage || 'English');

        return NextResponse.json({ translated });
    } catch (error: any) {
        console.error('Translation API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to translate text' },
            { status: 500 }
        );
    }
}
