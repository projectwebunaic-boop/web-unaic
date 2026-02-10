import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'activities.json');

// Interface for Activity
interface Activity {
    id: string;
    title: string;
    titleEn?: string;
    description: string;
    descriptionEn?: string;
    content: string; // Full HTML/Markdown content
    contentEn?: string;
    date: string;
    dateEn?: string;
    location: string;
    locationEn?: string;
    image: string;
    category: string;
    slug: string;
}

const readData = (): Activity[] => {
    try {
        if (!fs.existsSync(DB_PATH)) {
            // Ensure directory exists
            const dir = path.dirname(DB_PATH);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            // Initial seed data based on current page
            const initialData: Activity[] = [
                {
                    id: "1",
                    title: "Seminar Nasional Kesehatan Islami",
                    titleEn: "National Seminar on Islamic Health",
                    description: "Seminar yang membahas perkembangan terkini dalam kesehatan Islami dan penerapannya dalam kehidupan sehari-hari.",
                    descriptionEn: "A seminar discussing current developments in Islamic health and its application in daily life.",
                    content: "<p>Detail lengkap mengenai Seminar Nasional Kesehatan Islami. Acara ini dihadiri oleh para pakar...</p>",
                    contentEn: "<p>Full details regarding the National Seminar on Islamic Health. This event was attended by experts...</p>",
                    date: "25 Oktober 2025",
                    dateEn: "October 25, 2025",
                    location: "Aula UNAIC",
                    locationEn: "UNAIC Hall",
                    image: "/images/kegiatan/seminar-kesehatan.jpg",
                    category: "Seminar",
                    slug: "seminar-nasional-kesehatan-islami"
                },
                // ... more initial data could be added
            ];

            fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
            return initialData;
        }
        const fileData = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(fileData);
    } catch (e) {
        return [];
    }
};

const writeData = (data: Activity[]) => {
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
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        const title = formData.get('title') as string;
        const titleEn = formData.get('titleEn') as string;
        const description = formData.get('description') as string;
        const descriptionEn = formData.get('descriptionEn') as string;
        const content = formData.get('content') as string;
        const contentEn = formData.get('contentEn') as string;
        const date = formData.get('date') as string;
        const dateEn = formData.get('dateEn') as string;
        const location = formData.get('location') as string;
        const locationEn = formData.get('locationEn') as string;
        const category = formData.get('category') as string;

        let data = readData();

        // Generate Slug
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        let imageUrl = "/images/placeholder-activity.jpg";

        // Handle File Upload
        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `activity-${Date.now()}-${file.name.replace(/\s/g, '-')}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'activities');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, filename);
            fs.writeFileSync(filePath, buffer);
            imageUrl = `/uploads/activities/${filename}`;
        }

        const newActivity: Activity = {
            id: Date.now().toString(),
            title,
            titleEn,
            description,
            descriptionEn,
            content,
            contentEn,
            date,
            dateEn,
            location,
            locationEn,
            image: imageUrl,
            category,
            slug
        };

        data.push(newActivity);
        writeData(data);

        return NextResponse.json({ success: true, data: newActivity });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: false, error: 'Failed to create activity' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ success: false, error: 'ID Required' }, { status: 400 });

        let data = readData();
        const initialLength = data.length;
        data = data.filter(item => item.id !== id);

        if (data.length === initialLength) {
            return NextResponse.json({ success: false, error: 'Activity not found' }, { status: 404 });
        }

        writeData(data);
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const formData = await req.formData();
        const id = formData.get('id') as string;

        if (!id) return NextResponse.json({ success: false, error: 'ID Required' }, { status: 400 });

        let data = readData();
        const index = data.findIndex(item => item.id === id);

        if (index === -1) {
            return NextResponse.json({ success: false, error: 'Activity not found' }, { status: 404 });
        }

        const file = formData.get('file') as File | null;
        const title = formData.get('title') as string;
        const titleEn = formData.get('titleEn') as string;
        const description = formData.get('description') as string;
        const descriptionEn = formData.get('descriptionEn') as string;
        const content = formData.get('content') as string;
        const contentEn = formData.get('contentEn') as string;
        const date = formData.get('date') as string;
        const dateEn = formData.get('dateEn') as string;
        const location = formData.get('location') as string;
        const locationEn = formData.get('locationEn') as string;
        const category = formData.get('category') as string;

        // Keep existing image if no new file
        let imageUrl = data[index].image;

        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `activity-${Date.now()}-${file.name.replace(/\s/g, '-')}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'activities');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, filename);
            fs.writeFileSync(filePath, buffer);
            imageUrl = `/uploads/activities/${filename}`;
        }

        // Update fields
        data[index] = {
            ...data[index],
            title: title || data[index].title,
            titleEn: titleEn || data[index].titleEn,
            description: description || data[index].description,
            descriptionEn: descriptionEn || data[index].descriptionEn,
            content: content || data[index].content,
            contentEn: contentEn || data[index].contentEn,
            date: date || data[index].date,
            dateEn: dateEn || data[index].dateEn,
            location: location || data[index].location,
            locationEn: locationEn || data[index].locationEn,
            category: category || data[index].category,
            image: imageUrl,
            slug: title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : data[index].slug
        };

        writeData(data);

        return NextResponse.json({ success: true, data: data[index] });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 });
    }
}
