import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { writeFile } from 'fs/promises';
import { validateFile } from '@/lib/upload-security';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Use Security Utility
        const validation = await validateFile(buffer, file.name);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const filename = validation.filename!;

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), "public/uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        // Security recommendation: Log the upload if needed
        console.log(`[Upload] File saved: ${filename} (Mime: ${validation.mimeType})`);

        return NextResponse.json({
            message: 'Success',
            url: `/uploads/${filename}`,
            originalName: file.name
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: 'Internal server error during upload' }, { status: 500 });
    }
}

