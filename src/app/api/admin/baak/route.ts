import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const dataFilePath = path.join(process.cwd(), 'src/data/baak.json');
const responsesFilePath = path.join(process.cwd(), 'src/data/baak_responses.json');

function readData() {
    if (!fs.existsSync(dataFilePath)) return { services: [], questions: [] };
    const content = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(content);
}

function writeData(data: any) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

function readResponses() {
    if (!fs.existsSync(responsesFilePath)) return [];
    try {
        const content = fs.readFileSync(responsesFilePath, 'utf-8');
        return JSON.parse(content);
    } catch (e) {
        return [];
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    if (type === 'responses') {
        const responses = readResponses();
        return NextResponse.json(responses);
    }

    const data = readData();
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = readData();

        if (body.type === 'update_services') {
            data.services = body.services;
        } else if (body.type === 'update_questions') {
            data.questions = body.questions;
        } else if (body.type === 'update_contact') {
            data.contact = body.contact;
        }

        writeData(data);
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
    }
}
