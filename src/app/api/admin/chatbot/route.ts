import { NextRequest, NextResponse } from 'next/server';
import { getKnowledgeBase, addKnowledgeItem, updateKnowledgeItem, deleteKnowledgeItem } from '@/lib/chatbot';

export async function GET() {
    const data = getKnowledgeBase();
    return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { topics, keywords, answer, isActive } = body;

        if (!answer || !keywords) {
            return NextResponse.json({ error: 'Keywords and Answer are required' }, { status: 400 });
        }

        const newItem = addKnowledgeItem({
            topics: topics || [],
            keywords: Array.isArray(keywords) ? keywords : [keywords],
            answer,
            isActive: isActive !== undefined ? isActive : true
        });

        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const updatedItem = updateKnowledgeItem(id, updates);

        if (!updatedItem) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json(updatedItem);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const success = deleteKnowledgeItem(id);

        if (!success) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
