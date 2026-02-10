import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const responsesFilePath = path.join(process.cwd(), 'src/data/baak_responses.json');

function readResponses() {
    if (!fs.existsSync(responsesFilePath)) return [];
    try {
        const content = fs.readFileSync(responsesFilePath, 'utf-8');
        return JSON.parse(content);
    } catch (e) {
        return [];
    }
}

function writeResponses(data: any[]) {
    fs.writeFileSync(responsesFilePath, JSON.stringify(data, null, 2));
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Basic validation
        if (!body.name || !body.responses) {
            return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
        }

        const newResponse = {
            id: crypto.randomUUID(),
            submittedAt: new Date().toISOString(),
            ...body
        };

        const responses = readResponses();
        responses.unshift(newResponse); // Add to beginning
        writeResponses(responses);

        return NextResponse.json({ success: true, data: newResponse });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to submit survey' }, { status: 500 });
    }
}
