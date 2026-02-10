
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    console.log("Starting data synchronization from lpm.json to Database...");

    const jsonPath = path.join(process.cwd(), 'src/data/lpm.json');
    if (!fs.existsSync(jsonPath)) {
        console.error("lpm.json not found!");
        return;
    }

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // 1. Sync Profile
    console.log("Syncing Profile...");
    const profile = data.profile || {};
    const about = data.about || {};
    await prisma.lpmProfile.upsert({
        where: { id: 1 },
        update: {
            about: about.content,
            aboutEn: about.contentEn,
            vision: profile.vision,
            visionEn: profile.visionEn,
            mission: JSON.stringify(profile.mission || []),
            missionEn: JSON.stringify(profile.missionEn || []),
        },
        create: {
            id: 1,
            about: about.content,
            aboutEn: about.contentEn,
            vision: profile.vision,
            visionEn: profile.visionEn,
            mission: JSON.stringify(profile.mission || []),
            missionEn: JSON.stringify(profile.missionEn || []),
        }
    });

    // 2. Sync Staff
    console.log("Syncing Staff...");
    if (data.structure) {
        for (const [idx, s] of data.structure.entries()) {
            await prisma.lpmStaff.create({
                data: {
                    name: s.name,
                    position: s.position,
                    positionEn: s.positionEn,
                    image: s.image,
                    order: idx
                }
            }).catch(() => { }); // Skip duplicates or errors
        }
    }

    // 3. Sync Criteria
    console.log("Syncing Criteria...");
    if (data.criteria) {
        for (const [idx, c] of data.criteria.entries()) {
            await prisma.lpmCriterion.upsert({
                where: { slug: c.slug },
                update: {
                    title: c.title,
                    titleEn: c.titleEn,
                    subtitle: c.subtitle,
                    subtitleEn: c.subtitleEn,
                    description: c.description,
                    descriptionEn: c.descriptionEn,
                    icon: c.icon,
                    order: idx
                },
                create: {
                    title: c.title,
                    titleEn: c.titleEn,
                    subtitle: c.subtitle,
                    subtitleEn: c.subtitleEn,
                    description: c.description,
                    descriptionEn: c.descriptionEn,
                    icon: c.icon,
                    slug: c.slug,
                    order: idx
                }
            });
        }
    }

    // 4. Sync Agendas
    console.log("Syncing Agendas...");
    if (data.agendas) {
        for (const a of data.agendas) {
            await prisma.lpmAgenda.upsert({
                where: { slug: a.slug },
                update: {
                    title: a.title,
                    titleEn: a.titleEn,
                    date: new Date(a.date),
                    location: a.location,
                    locationEn: a.locationEn,
                    description: a.description,
                    descriptionEn: a.descriptionEn,
                    thumbnail: a.image
                },
                create: {
                    title: a.title,
                    titleEn: a.titleEn,
                    slug: a.slug,
                    date: new Date(a.date),
                    location: a.location,
                    locationEn: a.locationEn,
                    description: a.description,
                    descriptionEn: a.descriptionEn,
                    thumbnail: a.image
                }
            });
        }
    }

    // 5. Sync Documents
    console.log("Syncing Documents...");
    if (data.documents) {
        for (const [idx, d] of data.documents.entries()) {
            await prisma.lpmDocument.create({
                data: {
                    title: d.title,
                    titleEn: d.titleEn,
                    year: d.year,
                    url: d.url,
                    category: d.category,
                    order: idx
                }
            }).catch(() => { });
        }
    }

    // 6. Sync Hero & Contact (PageContent)
    console.log("Syncing Hero & Contact...");
    await prisma.pageContent.upsert({
        where: { pageSlug_section: { pageSlug: 'lpm', section: 'hero' } },
        update: { content: JSON.stringify(data.hero) },
        create: { pageSlug: 'lpm', section: 'hero', content: JSON.stringify(data.hero) }
    });
    await prisma.pageContent.upsert({
        where: { pageSlug_section: { pageSlug: 'lpm', section: 'contact' } },
        update: { content: JSON.stringify(data.contact) },
        create: { pageSlug: 'lpm', section: 'contact', content: JSON.stringify(data.contact) }
    });

    console.log("Synchronization complete!");
    process.exit(0);
}

main();
