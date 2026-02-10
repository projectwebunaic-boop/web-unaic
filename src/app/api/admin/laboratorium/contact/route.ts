import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const dataPath = path.join(process.cwd(), 'src/data/lab-contact.json');

// Helper to read data
function getContactData() {
    if (!fs.existsSync(dataPath)) {
        return {
            name: "",
            phone: "",
            email: "",
            address: ""
        };
    }
    const fileParams = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(fileParams);
}

// Helper to write data
function saveContactData(data: any) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

export async function GET() {
    try {
        const data = getContactData();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        saveContactData(body);
        return NextResponse.json({ message: 'Contact updated', data: body });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
    }
}
