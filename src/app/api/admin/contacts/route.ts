import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/contacts.json');

function readData() {
    if (!fs.existsSync(dataPath)) {
        return {
            address: "",
            phone: "",
            whatsapp: "",
            email: "",
            operationalHours: "",
            operationalHoursEn: "",
            mapsUrl: "",
            socialMedia: [],
            departments: []
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
        return NextResponse.json({ error: 'Failed to fetch contact data' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = readData();

        // Update based on body fields
        if (body.type === 'update_info') {
            data.address = body.address;
            data.phone = body.phone;
            data.whatsapp = body.whatsapp;
            data.email = body.email;
            data.operationalHours = body.operationalHours;
            data.operationalHoursEn = body.operationalHoursEn;
            data.mapsUrl = body.mapsUrl;
        } else if (body.type === 'update_social') {
            data.socialMedia = body.socialMedia;
        } else if (body.type === 'update_departments') {
            data.departments = body.departments;
        } else if (body.type === 'update_all') {
            Object.assign(data, body.data);
        }

        writeData(data);
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update contact data' }, { status: 500 });
    }
}
