
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/profile.json');

// Ensure data file exists
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({
        hero: { title: "", subtitle: "" },
        history: { title: "", content: "", image: "" },
        identity: [],
        values: [],
        media: { gallery: [], video: { src: "", poster: "" } }
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
        if (type === 'update_hero') {
            newData.hero = payload.hero;
        } else if (type === 'update_history') {
            newData.history = payload.history;
        } else if (type === 'update_identity') {
            newData.identity = payload.identity;
        } else if (type === 'update_values') {
            newData.values = payload.values;
        } else if (type === 'update_media') {
            newData.media = payload.media;
        } else if (type === 'update_timeline') {
            newData.timeline = payload.timeline;
        } else if (type === 'update_stats') {
            newData.stats = payload.stats;
        } else if (type === 'update_archive_gallery') {
            newData.archiveGallery = payload.archiveGallery;
        } else if (type === 'update_vision') {
            newData.vision = payload.vision;
        } else if (type === 'update_mission') {
            newData.mission = payload.mission;
        } else {
            return NextResponse.json({ error: 'Invalid update type' }, { status: 400 });
        }

        // Write back to file
        fs.writeFileSync(dataPath, JSON.stringify(newData, null, 2));

        return NextResponse.json({ success: true, data: newData });

    } catch (error) {
        console.error("Error saving profile data:", error);
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
