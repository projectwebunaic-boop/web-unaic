import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/baukk.json');

function readData() {
    if (!fs.existsSync(dataPath)) {
        return {
            hero: { title: "", subtitle: "" },
            services: [],
            audits: [],
            faqs: [],
            contact: { address: "", whatsapp: "", email: "" }
        };
    }
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(fileContent);
}

function writeData(data: any) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

export async function GET() {
    try {
        const data = readData();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = readData();

        if (body.type === 'update_hero') {
            data.hero = body.hero;
        } else if (body.type === 'update_services') {
            data.services = body.services;
        } else if (body.type === 'update_audits') {
            data.audits = body.audits;
        } else if (body.type === 'update_faqs') {
            data.faqs = body.faqs;
        } else if (body.type === 'update_contact') {
            data.contact = body.contact;
        }

        writeData(data);
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
    }
}
