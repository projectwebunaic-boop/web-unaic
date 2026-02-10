import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function POST() {
    try {
        const dataPath = path.join(process.cwd(), 'src/data/lppm.json');

        if (!fs.existsSync(dataPath)) {
            return NextResponse.json({ error: 'Source migration file not found' }, { status: 404 });
        }

        const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        // 1. Migrate Profile
        await prisma.lppmProfile.upsert({
            where: { id: 'singleton' },
            update: {
                vision: jsonData.vision,
                mission: JSON.stringify(jsonData.mission || []),
                tasks: JSON.stringify(jsonData.tasks || []),
                ctaTitle: jsonData.proposalCta?.title,
                ctaDescription: jsonData.proposalCta?.description,
                ctaButtonText: jsonData.proposalCta?.buttonText,
                ctaButtonLink: jsonData.proposalCta?.buttonLink,
            },
            create: {
                id: 'singleton',
                vision: jsonData.vision,
                mission: JSON.stringify(jsonData.mission || []),
                tasks: JSON.stringify(jsonData.tasks || []),
                ctaTitle: jsonData.proposalCta?.title,
                ctaDescription: jsonData.proposalCta?.description,
                ctaButtonText: jsonData.proposalCta?.buttonText,
                ctaButtonLink: jsonData.proposalCta?.buttonLink,
            }
        });

        // 2. Migrate Staff (Organization)
        // Clear existing staff first to avoid duplicates or just clean start
        await prisma.lppmStaff.deleteMany({});

        const staffData = jsonData.organization || {};
        const staffToCreate = [
            { key: 'kepalaLembaga', order: 1 },
            { key: 'kabagPenelitian', order: 2 },
            { key: 'kabagPKM', order: 3 },
            { key: 'komiteEtik', order: 4 },
            { key: 'kasubagPenelitian', order: 5 },
            { key: 'kasubagJurnal', order: 6 },
            { key: 'kasubagPKM', order: 7 }
        ];

        for (const item of staffToCreate) {
            const person = staffData[item.key];
            if (person && person.name) {
                await prisma.lppmStaff.create({
                    data: {
                        name: person.name,
                        position: person.title,
                        order: item.order
                    }
                });
            }
        }

        return NextResponse.json({ message: 'Migration successful' });
    } catch (error: any) {
        console.error('Migration error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
