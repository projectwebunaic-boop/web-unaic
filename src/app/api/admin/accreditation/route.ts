
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/accreditation.json');

// Ensure data file exists
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({
        history: [],
        faculties: [],
        programs: []
    }, null, 2));
}

export async function GET() {
    try {
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

        const fileContent = fs.readFileSync(dataPath, 'utf-8');
        const currentData = JSON.parse(fileContent);

        let newData = { ...currentData };

        if (type === 'update_history') {
            newData.history = payload.history;
        } else if (type === 'update_faculties') {
            newData.faculties = payload.faculties;
        } else if (type === 'update_programs') {
            newData.programs = payload.programs;
        } else {
            return NextResponse.json({ error: 'Invalid update type' }, { status: 400 });
        }

        fs.writeFileSync(dataPath, JSON.stringify(newData, null, 2));

        return NextResponse.json({ success: true, data: newData });

    } catch (error) {
        console.error("Error saving accreditation data:", error);
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
