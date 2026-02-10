import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'admin_settings.json');

// Default Settings
const DEFAULT_SETTINGS = {
    profile: {
        name: "Admin UNAIC",
        email: "admin@unaic.ac.id"
    },
    security: {
        pin: "1234",
        lastChanged: new Date().toISOString()
    },
    notifications: {
        emailAlerts: true,
        newComplaint: true,
        reportBundling: false
    },
    general: {
        language: "id",
        maintenanceMode: false
    },
    contact: {
        phone: "(0282) 532975",
        email: "info@universitasalirsyad.ac.id",
        address: "Jl. Cerme No. 24, Sidanegara, Cilacap"
    },
    chatbot: {
        geminiApiKey: ""
    }
};


const readData = () => {
    try {
        if (!fs.existsSync(DB_PATH)) {
            // Ensure directory exists
            const dir = path.dirname(DB_PATH);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
            return DEFAULT_SETTINGS;
        }
        const fileData = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(fileData);
    } catch (e) {
        return DEFAULT_SETTINGS;
    }
};

const writeData = (data: any) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
        console.error("Write Error:", e);
    }
};

export async function GET() {
    const data = readData();
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const currentData = readData();

        // Deep merge or specific section update
        const newData = {
            ...currentData,
            ...body
        };

        writeData(newData);
        return NextResponse.json({ success: true, data: newData });
    } catch (e) {
        return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
    }
}
