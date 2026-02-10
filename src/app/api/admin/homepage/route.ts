import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'homepage.json');

// Helper to read data
const readData = () => {
    try {
        if (!fs.existsSync(DB_PATH)) {
            // Default fallback if file missing
            return {
                hero: {
                    welcomePrefix: "Welcome to",
                    title: "UNAIC",
                    subtitle: "Universitas Al-Irsyad Cilacap...",
                    videoUrl: "/video/hero/herolooping.mp4"
                },
                services: [],
                testimonials: {},
                faculty: {},
                gallery: { images: [] },
                partners: {},
                news: {}
            };
        }
        const fileData = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(fileData);
    } catch (e) {
        console.error("Read Error:", e);
        return {};
    }
};

// Helper to write data
const writeData = (data: any) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
        console.error("Write Error:", e);
        throw e;
    }
};

export async function GET() {
    const data = readData();
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // Simple merge strategy: update provided keys
        const currentData = readData();
        const updatedData = { ...currentData, ...body };

        writeData(updatedData);

        return NextResponse.json({ success: true, data: updatedData });
    } catch (e: any) {
        console.error("API Error:", e);
        return NextResponse.json({
            success: false,
            error: e.message || 'Unknown error occurred',
            details: JSON.stringify(e)
        }, { status: 500 });
    }
}
