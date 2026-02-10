import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET Handler
export async function GET() {
    try {
        const [categories, staff] = await Promise.all([
            prisma.staffCategory.findMany({ orderBy: { order: 'asc' } }),
            prisma.staff.findMany({ orderBy: { order: 'asc' } })
        ]);
        return NextResponse.json({ categories, staff });
    } catch (error) {
        console.error("Staff API GET Error:", error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

// POST Handler
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, categories, staff } = body;

        if (type === 'update_categories') {
            // Bulk update categories (delete existing and recreate or upsert)
            // For simplicity in this specific UI pattern, we'll upsert or sync
            // Re-syncing logic:
            const existingIds = categories.filter((c: any) => !c.id.includes('-')).map((c: any) => c.id);

            for (const cat of categories) {
                await prisma.staffCategory.upsert({
                    where: { id: cat.id },
                    update: {
                        name: cat.name,
                        nameEn: cat.nameEn || "",
                        slug: cat.slug,
                        order: cat.order || 0
                    },
                    create: {
                        id: cat.id,
                        name: cat.name,
                        nameEn: cat.nameEn || "",
                        slug: cat.slug,
                        order: cat.order || 0
                    }
                });
            }
        } else if (type === 'update_staff') {
            for (const s of staff) {
                await prisma.staff.upsert({
                    where: { id: s.id },
                    update: {
                        name: s.name,
                        role: s.role,
                        roleEn: s.roleEn || "",
                        nidn: s.nidn || "",
                        image: s.image || "",
                        scholarUrl: s.scholarUrl || "",
                        categoryId: s.categoryId,
                        order: s.order || 0
                    },
                    create: {
                        id: s.id,
                        name: s.name,
                        role: s.role,
                        roleEn: s.roleEn || "",
                        nidn: s.nidn || "",
                        image: s.image || "",
                        scholarUrl: s.scholarUrl || "",
                        categoryId: s.categoryId,
                        order: s.order || 0
                    }
                });
            }
        }

        return NextResponse.json({ success: true, message: 'Data saved successfully' });
    } catch (error) {
        console.error("Staff API POST Error:", error);
        return NextResponse.json({ success: false, error: 'Failed to save data' }, { status: 500 });
    }
}
