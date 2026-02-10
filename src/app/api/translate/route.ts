import { NextRequest, NextResponse } from 'next/server';
import { translateText } from '@/lib/translate';

export async function POST(request: NextRequest) {
    try {
        const { text, targetLanguage } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const translatedText = await translateText(text, targetLanguage || 'English');
        return NextResponse.json({ translatedText });
    } catch (error: any) {
        console.error('API Translation Error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to translate text'
        }, { status: 500 });
    }
}
