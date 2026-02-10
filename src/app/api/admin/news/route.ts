
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/news.json');

// Ensure data file exists
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
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
        const { id, type, ...newItem } = body;

        const fileContent = fs.readFileSync(dataPath, 'utf-8');
        let data = JSON.parse(fileContent);

        if (type === 'DELETE') {
            data = data.filter((item: any) => item.id !== id);
        } else if (id) {
            // Update existing
            const index = data.findIndex((item: any) => item.id === id);
            if (index !== -1) {
                data[index] = { ...data[index], ...newItem };
            } else {
                // Or create with provided ID if not found (shouldn't happen in normal flow but good for safety)
                data.unshift({ id, ...newItem });
            }
        } else {
            // Create new
            const newId = crypto.randomUUID();
            data.unshift({ id: newId, ...newItem });
        }

        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error("Error saving news data:", error);
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
