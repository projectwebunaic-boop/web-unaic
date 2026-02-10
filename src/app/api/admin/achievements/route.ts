
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/achievements.json');

// Ensure data file exists
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({
        stats: [],
        highlights: [],
        carousel: [],
        timeline: []
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

        // Read current data
        const fileContent = fs.readFileSync(dataPath, 'utf-8');
        const currentData = JSON.parse(fileContent);

        let newData = { ...currentData };

        // Update logic based on type
        if (type === 'update_stats') {
            newData.stats = payload.stats;
        } else if (type === 'update_highlights') {
            newData.highlights = payload.highlights;
        } else if (type === 'update_carousel') {
            newData.carousel = payload.carousel;
        } else if (type === 'update_timeline') {
            newData.timeline = payload.timeline;
        } else {
            return NextResponse.json({ error: 'Invalid update type' }, { status: 400 });
        }

        // Write back to file
        fs.writeFileSync(dataPath, JSON.stringify(newData, null, 2));

        return NextResponse.json({ success: true, data: newData });

    } catch (error) {
        console.error("Error saving achievements data:", error);
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
