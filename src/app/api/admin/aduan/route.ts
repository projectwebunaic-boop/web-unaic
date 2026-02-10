import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { validateFile } from '@/lib/upload-security';


// Path to our JSON "database"
const DB_PATH = path.join(process.cwd(), 'src', 'data', 'complaints_db.json');

// Helper to read data
const readData = () => {
    try {
        if (!fs.existsSync(DB_PATH)) {
            fs.writeFileSync(DB_PATH, '[]', 'utf-8');
            return [];
        }
        const fileData = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(fileData);
    } catch (e) {
        console.error("Read Error:", e);
        return [];
    }
};

// Helper to write data
const writeData = (data: any[]) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
        console.error("Write Error:", e);
    }
};

export async function GET() {
    const data = readData();
    // Sort by newest first
    const sortedDetails = data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return NextResponse.json(sortedDetails);
}

import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit(10, 60000); // 10 complaints per minute

export async function POST(req: Request) {
    // Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    if (limiter.check(ip).isRateLimited) {
        return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }

    try {

        const formData = await req.formData();
        const category = formData.get('category') as string;
        const title = formData.get('title') as string;
        const desc = formData.get('desc') as string;
        const reporter = formData.get('reporter') as string;
        const file = formData.get('file') as File | null;

        const data = readData();

        let imageUrl = "";

        // Handle File Upload
        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());

            // Use Security Utility
            const validation = await validateFile(buffer, file.name);

            if (!validation.success) {
                return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
            }

            const filename = validation.filename!;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');

            // Ensure dir exists
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, filename);
            fs.writeFileSync(filePath, buffer);
            imageUrl = `/uploads/${filename}`;
            console.log(`[Aduan] Securely uploaded: ${filename}`);
        }


        const newComplaint = {
            id: `TIC-${new Date().getFullYear()}${String(data.length + 1).padStart(3, '0')}`,
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            category,
            title,
            desc,
            reporter,
            imageUrl
        };

        data.push(newComplaint);
        writeData(data);

        return NextResponse.json({ success: true, data: newComplaint });
    } catch (e) {
        console.error("Upload Error:", e);
        return NextResponse.json({ success: false, error: 'Failed to save' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, status } = body;

        let data = readData();
        const index = data.findIndex((item: any) => item.id === id);

        if (index === -1) {
            return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
        }

        data[index].status = status;
        writeData(data);

        return NextResponse.json({ success: true, data: data[index] });
    } catch (e) {
        return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 });
    }
}
