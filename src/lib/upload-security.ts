import { crypto } from 'next/dist/compiled/@edge-runtime/primitives'; // Fallback if needed, but standard crypto is fine in Node
import { randomUUID } from 'crypto';
import path from 'path';

export interface UploadResult {
    success: boolean;
    filename?: string;
    error?: string;
    mimeType?: string;
}

// Allowed Magic Numbers
const MAGIC_NUMBERS = {
    pdf: [0x25, 0x50, 0x44, 0x46], // %PDF
    jpg: [0xFF, 0xD8, 0xFF],      // JPEG
    png: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] // PNG
};

export async function validateFile(buffer: Buffer, originalName: string): Promise<UploadResult> {
    // 1. Check File Size (already 10MB in plan, but let's define limits here)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (buffer.length > MAX_SIZE) {
        return { success: false, error: 'File size too large (Max 10MB)' };
    }

    // 2. Extract Extension
    const ext = path.extname(originalName).toLowerCase();

    // 3. Simple Magic Number Check
    let isValid = false;
    let detectedMime = '';

    if (ext === '.pdf' && buffer.slice(0, 4).equals(Buffer.from(MAGIC_NUMBERS.pdf))) {
        isValid = true;
        detectedMime = 'application/pdf';
    } else if ((ext === '.jpg' || ext === '.jpeg') && buffer.slice(0, 3).equals(Buffer.from(MAGIC_NUMBERS.jpg))) {
        isValid = true;
        detectedMime = 'image/jpeg';
    } else if (ext === '.png' && buffer.slice(0, 8).equals(Buffer.from(MAGIC_NUMBERS.png))) {
        isValid = true;
        detectedMime = 'image/png';
    }

    if (!isValid) {
        return { success: false, error: 'Invalid file type or corrupted file content' };
    }

    // 4. Generate UUID name
    const newFilename = `${randomUUID()}${ext}`;

    return {
        success: true,
        filename: newFilename,
        mimeType: detectedMime
    };
}
