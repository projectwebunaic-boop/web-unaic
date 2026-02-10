const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function migrate() {
    console.log("Starting Faculty migration...");

    // 1. Read localization data
    const idMessages = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'messages/id.json'), 'utf-8'));
    const enMessages = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'messages/en.json'), 'utf-8'));

    // 2. Clear existing (optional, but good for idempotent development)
    // await prisma.facultyFacility.deleteMany({});
    // await prisma.facultyProgram.deleteMany({});
    // await prisma.faculty.deleteMany({});

    const facultyKeys = ['health', 'science', 'business'];

    // Mapping keys to slugs used in faculties.ts
    const keyToSlug = {
        'health': 'ilmu-kesehatan',
        'science': 'farmasi-sains-teknologi',
        'business': 'ekonomi-bisnis'
    };

    const icons = {
        'health': 'FaHeartbeat',
        'science': 'FaFlask',
        'business': 'FaChartLine'
    };

    const heroImages = {
        'health': '/images/hero-health.jpg',
        'science': '/images/hero/hero-science.jpg',
        'business': '/images/hero/hero-business.jpg'
    };

    const deanImages = {
        'health': '/images/pimpinan/dekan1.png',
        'science': '/images/pimpinan/dekan2.png',
        'business': '/images/pimpinan/dekan3.png'
    };

    for (const key of facultyKeys) {
        console.log(`Migrating Faculty: ${key}`);

        const idData = idMessages.Faculties[key];
        const enData = enMessages.Faculties[key];

        // Prepare program data
        const programs = [];
        for (const progKey in idData.programs) {
            programs.push({
                key: progKey,
                name: idData.programs[progKey],
                nameEn: enData.programs[progKey],
                slug: progKey.toLowerCase().replace(/_/g, '-'),
                level: idData.programs[progKey].split(' ')[0], // Rough level extraction
                accreditation: "Baik Sekali"
            });
        }

        // Prepare facility data
        const facilities = (idData.facilities || []).map((f, idx) => ({
            title: f.title,
            titleEn: enData.facilities?.[idx]?.title,
            description: f.description,
            descriptionEn: enData.facilities?.[idx]?.description,
            image: idx === 0 ? "/images/fasilitas/lab.jpg" :
                idx === 1 ? "/images/fasilitas/klinik.jpg" :
                    idx === 2 ? "/images/fasilitas/ruang-kelas.jpg" : "/images/fasilitas/perpustakaan.jpg",
            order: idx
        }));

        await prisma.faculty.upsert({
            where: { key },
            update: {
                name: idData.name,
                nameEn: enData.name,
                slug: keyToSlug[key],
                icon: icons[key],
                deanName: idData.dean.name,
                deanTitle: idData.dean.title,
                deanTitleEn: enData.dean.title,
                deanMessage: idData.dean.message,
                deanMessageEn: enData.dean.message,
                deanImage: deanImages[key],
                vision: idData.vision,
                visionEn: enData.vision,
                missions: JSON.stringify(idData.missions),
                missionsEn: JSON.stringify(enData.missions),
                heroImage: heroImages[key],
                programs: {
                    deleteMany: {},
                    create: programs
                },
                facilities: {
                    deleteMany: {},
                    create: facilities
                }
            },
            create: {
                key,
                name: idData.name,
                nameEn: enData.name,
                slug: keyToSlug[key],
                icon: icons[key],
                deanName: idData.dean.name,
                deanTitle: idData.dean.title,
                deanTitleEn: enData.dean.title,
                deanMessage: idData.dean.message,
                deanMessageEn: enData.dean.message,
                deanImage: deanImages[key],
                vision: idData.vision,
                visionEn: enData.vision,
                missions: JSON.stringify(idData.missions),
                missionsEn: JSON.stringify(enData.missions),
                heroImage: heroImages[key],
                programs: {
                    create: programs
                },
                facilities: {
                    create: facilities
                }
            }
        });
    }

    console.log("Faculty migration finished successfully!");
}

migrate()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
