
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/facilities.json');

export async function GET() {
    try {
        if (!fs.existsSync(dataPath)) {
            return NextResponse.json({ error: 'Data file not found' }, { status: 404 });
        }
        const fileContent = fs.readFileSync(dataPath, 'utf-8');
        const data = JSON.parse(fileContent);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, ...payload } = body;

        // Read current data
        if (!fs.existsSync(dataPath)) {
            return NextResponse.json({ error: 'Data file not found' }, { status: 404 });
        }
        const fileContent = fs.readFileSync(dataPath, 'utf-8');
        const currentData = JSON.parse(fileContent);

        let newData = { ...currentData };

        if (type === 'update_academic') {
            newData.academic = payload.academic;
        } else if (type === 'update_public') {
            newData.public = payload.public;
        } else if (type === 'update_gallery') {
            newData.gallery = payload.gallery;
        } else if (type === 'update_stats') {
            newData.stats = payload.stats;
        } else {
            return NextResponse.json({ error: 'Invalid update type' }, { status: 400 });
        }

        // Write back to file
        fs.writeFileSync(dataPath, JSON.stringify(newData, null, 2));

        return NextResponse.json({ success: true, data: newData });

    } catch (error) {
        console.error("Error saving facilities data:", error);
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
