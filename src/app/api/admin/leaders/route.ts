import { NextResponse } from 'next/server';

import prisma from "@/lib/prisma";
import path from 'path';
import fs from 'fs';

// const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), 'public/uploads/leaders');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

export const dynamic = 'force-dynamic';

function slugify(text: string): string {
    return text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export async function GET(req: Request) {
    // Optional: Filter by category?
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    try {
        const where = category ? { category } : {};
        const data = await prisma.leader.findMany({
            where: {
                ...where,
                isActive: true
            },
            orderBy: { order: 'asc' }
        });

        // Manual JSON parsing for SQLite compatibility
        const parsedData = data.map(leader => ({
            ...leader,
            education: leader.education ? JSON.parse(leader.education) : [],
            educationEn: leader.educationEn ? JSON.parse(leader.educationEn) : [],
            career: leader.career ? JSON.parse(leader.career) : [],
            careerEn: leader.careerEn ? JSON.parse(leader.careerEn) : [],
            research: leader.research ? JSON.parse(leader.research) : [],
            researchEn: leader.researchEn ? JSON.parse(leader.researchEn) : [],
        }));

        return NextResponse.json(parsedData);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch leaders' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const name = formData.get('name') as string;
        const title = formData.get('title') as string;
        const titleEn = formData.get('titleEn') as string;
        const category = formData.get('category') as string;
        const email = formData.get('email') as string;
        const scholar = formData.get('scholar') as string;
        const vision = formData.get('vision') as string;
        const visionEn = formData.get('visionEn') as string;
        const orderVal = formData.get('order');
        const order = orderVal ? parseInt(orderVal as string) : 0;
        const file = formData.get('image') as File | null;

        // JSON Arrays (Stored as Strings in SQLite)
        const educationRaw = formData.get('education') as string;
        const educationEnRaw = formData.get('educationEn') as string;
        const careerRaw = formData.get('career') as string;
        const careerEnRaw = formData.get('careerEn') as string;
        const researchRaw = formData.get('research') as string;
        const researchEnRaw = formData.get('researchEn') as string;

        if (!name || !title) {
            return NextResponse.json({ success: false, error: 'Name and Title are required' }, { status: 400 });
        }

        let imageUrl = '/images/placeholder-user.png';
        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `leader-${Date.now()}-${file.name.replace(/\s/g, '-')}`;
            const filePath = path.join(uploadDir, filename);
            fs.writeFileSync(filePath, buffer);
            imageUrl = `/uploads/leaders/${filename}`;
        }

        let slug = slugify(name);
        // Ensure slug uniqueness (simple check, assume unique enough for now or catch error)
        const conflict = await prisma.leader.findUnique({ where: { slug } });
        if (conflict) {
            slug = `${slug}-${Date.now()}`;
        }

        const newLeader = await prisma.leader.create({
            data: {
                name,
                title,
                titleEn,
                category: category || 'Lainnya',
                image: imageUrl,
                slug,
                email,
                scholar,
                vision,
                visionEn,
                education: educationRaw || '[]',
                educationEn: educationEnRaw || '[]',
                career: careerRaw || '[]',
                careerEn: careerEnRaw || '[]',
                research: researchRaw || '[]',
                researchEn: researchEnRaw || '[]',
                order: order,
            }
        });

        return NextResponse.json({ success: true, data: newLeader });
    } catch (error) {
        console.error("Error creating leader:", error);
        return NextResponse.json({ success: false, error: 'Failed to create leader' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const formData = await req.formData();
        const id = formData.get('id') as string;
        if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

        const name = formData.get('name') as string;
        const title = formData.get('title') as string;
        const titleEn = formData.get('titleEn') as string;
        const category = formData.get('category') as string;
        const email = formData.get('email') as string;
        const scholar = formData.get('scholar') as string;
        const vision = formData.get('vision') as string;
        const visionEn = formData.get('visionEn') as string;
        const orderValue = formData.get('order');
        const order = orderValue ? parseInt(orderValue as string) : undefined;
        const file = formData.get('image') as File | null;

        const educationRaw = formData.get('education') as string;
        const educationEnRaw = formData.get('educationEn') as string;
        const careerRaw = formData.get('career') as string;
        const careerEnRaw = formData.get('careerEn') as string;
        const researchRaw = formData.get('research') as string;
        const researchEnRaw = formData.get('researchEn') as string;

        // Fetch existing
        const existing = await prisma.leader.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

        let imageUrl = existing.image;
        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `leader-${Date.now()}-${file.name.replace(/\s/g, '-')}`;
            const filePath = path.join(uploadDir, filename);
            fs.writeFileSync(filePath, buffer);
            imageUrl = `/uploads/leaders/${filename}`;
        }

        let slug = existing.slug;
        if (name && name !== existing.name) {
            slug = slugify(name);
            // handle slug conflict if strict...
        }

        const updated = await prisma.leader.update({
            where: { id },
            data: {
                name: name || undefined,
                title: title || undefined,
                titleEn: titleEn || undefined,
                category: category || undefined,
                image: imageUrl,
                slug: slug,
                email: email || undefined,
                scholar: scholar || undefined,
                vision: vision || undefined,
                visionEn: visionEn || undefined,
                education: educationRaw || undefined,
                educationEn: educationEnRaw || undefined,
                career: careerRaw || undefined,
                careerEn: careerEnRaw || undefined,
                research: researchRaw || undefined,
                researchEn: researchEnRaw || undefined,
                order: order,
            }
        });

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        console.error("Error updating leader:", error);
        return NextResponse.json({ success: false, error: 'Failed to update leader' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ success: false, error: 'ID Required' }, { status: 400 });

        await prisma.leader.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
    }
}
