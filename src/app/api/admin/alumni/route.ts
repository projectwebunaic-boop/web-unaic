
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/alumni.json');

// Ensure data file exists
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({
        stats: [],
        services: [],
        communities: [],
        contributions: [],
        featured: [],
        stories: []
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

        switch (type) {
            case 'update_stats':
                newData.stats = payload.stats;
                break;
            case 'update_services':
                newData.services = payload.services;
                break;
            case 'update_communities':
                newData.communities = payload.communities;
                break;
            case 'update_contributions':
                newData.contributions = payload.contributions;
                break;
            case 'update_featured':
                newData.featured = payload.featured;
                break;
            case 'update_stories':
                newData.stories = payload.stories;
                break;
            default:
                return NextResponse.json({ error: 'Invalid update type' }, { status: 400 });
        }

        fs.writeFileSync(dataPath, JSON.stringify(newData, null, 2));

        return NextResponse.json({ success: true, data: newData });

    } catch (error) {
        console.error("Error saving alumni data:", error);
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
