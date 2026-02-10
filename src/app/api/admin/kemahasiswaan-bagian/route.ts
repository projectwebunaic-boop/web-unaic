import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/kemahasiswaan_bagian.json');

function readData() {
    if (!fs.existsSync(dataPath)) {
        return {
            hero: { title: "", subtitle: "" },
            profile: { title: "", content: "" },
            layanan_umum: { title: "", content: "" },
            sections: [],
            documents: []
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
        } else if (body.type === 'update_profile') {
            data.profile = body.profile;
        } else if (body.type === 'update_layanan_umum') {
            data.layanan_umum = body.layanan_umum;
        } else if (body.type === 'update_sections') {
            data.sections = body.sections;
        } else if (body.type === 'update_documents') {
            data.documents = body.documents;
        } else if (body.type === 'update_contact') {
            data.contact = body.contact;
        }

        writeData(data);
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update data' }, { status: 500 });
    }
}
