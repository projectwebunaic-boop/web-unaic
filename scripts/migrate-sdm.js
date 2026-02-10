const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function migrate() {
    console.log("Starting SDM migration...");

    const dataPath = path.join(process.cwd(), 'src/data/sdm.json');
    if (!fs.existsSync(dataPath)) {
        console.error("sdm.json not found!");
        return;
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // 1. Migrate Categories
    console.log("Migrating Categories...");
    for (const cat of data.categories) {
        await prisma.staffCategory.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name },
            create: {
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                order: 0
            }
        });
    }

    // 2. Migrate Staff
    console.log("Migrating Staff...");
    for (const s of data.staff) {
        await prisma.staff.upsert({
            where: { id: s.id },
            update: {
                name: s.name,
                role: s.role,
                nidn: s.nidn,
                image: s.image,
                scholarUrl: s.scholarUrl || "",
                categoryId: s.categoryId
            },
            create: {
                id: s.id,
                name: s.name,
                role: s.role,
                nidn: s.nidn,
                image: s.image,
                scholarUrl: s.scholarUrl || "",
                categoryId: s.categoryId
            }
        });
    }

    console.log("Migration finished successfully!");
    await prisma.$disconnect();
}

migrate().catch(e => {
    console.error(e);
    process.exit(1);
});
