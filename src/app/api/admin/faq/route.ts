import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/data/faq.json');

// Helper to read data
function getData() {
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, '[]', 'utf8');
        return [];
    }
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    try {
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

// Helper to save data
function saveData(data: any[]) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET() {
    const data = getData();
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const data = getData();

        // If id exists, update. Else create new.
        if (body.id) {
            const index = data.findIndex((item: any) => item.id === body.id);
            if (index !== -1) {
                data[index] = { ...data[index], ...body };
            } else {
                // Fallback if ID sent but not found, treat as new? Or error. 
                // Let's treat ID as mainly for updates, but if we want to force ID:
                data.push(body);
            }
        } else {
            const newItem = {
                id: Date.now().toString(),
                ...body
            };
            data.push(newItem);
        }

        saveData(data);
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
        }

        const data = getData();
        const newData = data.filter((item: any) => item.id !== id);
        saveData(newData);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
    }
}
