import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Data Sources content pasted for simplicity or loaded if JSON
function getNewsData() {
    const filePath = path.join(process.cwd(), 'src/data/news.json');
    if (!fs.existsSync(filePath)) return [];
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
}

function getLeadersData() {
    const filePath = path.join(process.cwd(), 'src/data/leaders.json');
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

const fullAgendaData = [
    {
        slug: "seminar-kesehatan-unaic-2025",
        title: "Seminar Nasional Kesehatan UNAIC 2025",
        date: "2025-11-25",
        time: "08:00 - 16:00 WIB",
        location: "Aula Utama Kampus UNAIC",
        organizer: "Fakultas Ilmu Kesehatan UNAIC",
        image: "/images/agenda/seminar2025.jpg",
        description: `<p>Universitas Al-Irsyad Cilacap (UNAIC) kembali mengadakan Seminar Nasional Kesehatan.</p>`,
    },
    {
        slug: "pelatihan-digital-literacy-2025",
        title: "Pelatihan Digital Literacy Mahasiswa UNAIC 2025",
        date: "2025-12-10",
        time: "09:00 - 12:00 WIB",
        location: "Lab Komputer Gedung D UNAIC",
        organizer: "Fakultas Sains dan Teknologi",
        image: "/images/agenda/digital-literacy.jpg",
        description: `<p>Kegiatan pelatihan ini bertujuan untuk meningkatkan kemampuan mahasiswa.</p>`,
    },
    {
        slug: "wisuda-unaic-angkatan-2025",
        title: "Wisuda UNAIC Angkatan 2025",
        date: "2025-12-15",
        time: "08:00 - 14:00 WIB",
        location: "Gedung Serbaguna UNAIC",
        organizer: "Universitas Al-Irsyad Cilacap",
        image: "/images/agenda/wisuda2025.jpg",
        description: `<p>Upacara wisuda untuk mahasiswa angkatan 2025.</p>`,
    },
    {
        slug: "workshop-kewirausahaan-digital",
        title: "Workshop Kewirausahaan Digital",
        date: "2026-01-05",
        time: "09:00 - 16:00 WIB",
        location: "Lab Komputer UNAIC",
        organizer: "Fakultas Ekonomi Bisnis UNAIC",
        image: "/images/agenda/kewirausahaan.jpg",
        description: `<p>Workshop intensif tentang strategi membangun bisnis digital.</p>`,
    },
    {
        slug: "festival-budaya-unaic-2026",
        title: "Festival Budaya UNAIC 2026",
        date: "2026-02-20",
        time: "16:00 - 22:00 WIB",
        location: "Lapangan UNAIC",
        organizer: "UKM UNAIC",
        image: "/images/agenda/festival-budaya.jpg",
        description: `<p>Festival tahunan yang menampilkan berbagai pertunjukan seni.</p>`,
    },
    {
        slug: "kuliah-umum-prof-dr-ahmad-rahman",
        title: "Kuliah Umum Prof. Dr. Ahmad Rahman",
        date: "2026-03-10",
        time: "13:00 - 15:00 WIB",
        location: "Aula UNAIC",
        organizer: "Fakultas Farmasi UNAIC",
        image: "/images/agenda/kuliah-umum.jpg",
        description: `<p>Kuliah umum dengan tema 'Inovasi Farmasi di Era Digital'.</p>`,
    },
];

async function cleanTables() {
    console.log("🧹 Cleaning up existing data...");
    // Order matters for FK
    const models = [
        'Post', 'Agenda', 'FacultyProgram', 'Leader', 'Faculty',
        'Staff', 'StaffCategory', 'FacultyFacility', 'Laboratory',
        'LpmDocument', 'LpmCriterion', 'PageContent', 'Publication',
        'ResearchProject', 'PkmProject', 'ResearchConfig', 'PkmConfig',
        'LaboratoryConfig', 'LppmProfile', 'LppmStaff', 'PkmProgram'
    ];

    for (const model of models) {
        try {
            // @ts-ignore
            if (prisma[model]) {
                // @ts-ignore
                await prisma[model].deleteMany({});
                console.log(`✅ Cleared ${model}`);
            }
        } catch (e) {
            console.log(`⚠️  Could not clear ${model}: ${e.message}`);
        }
    }
}

async function main() {
    console.log("🚀 Starting MEGA IMPORT v3...");

    // 1. Clean up
    await cleanTables();

    // 2. Import News
    const newsData = getNewsData();
    console.log(`📤 Importing ${newsData.length} News items...`);
    for (const item of newsData) {
        try {
            await prisma.post.create({
                data: {
                    title: item.title,
                    slug: item.slug,
                    content: item.content || item.description || "",
                    excerpt: item.excerpt || "",
                    image: item.thumbnail || item.image || "",
                    author: item.author || "Admin",
                    category: item.category || "Berita",
                    isFeatured: item.isFeatured || false,
                    createdAt: new Date(),
                }
            });
        } catch (e) {
            console.error(`❌ Failed import news ${item.slug}:`, e.message);
        }
    }
    console.log("✅ News imported.");

    // 3. Import Agenda
    const agendaData = fullAgendaData;
    console.log(`📤 Importing ${agendaData.length} Agenda items...`);
    for (const item of agendaData) {
        try {
            await prisma.agenda.create({
                data: {
                    title: item.title,
                    slug: item.slug,
                    date: new Date(item.date),
                    time: item.time,
                    location: item.location,
                    thumbnail: item.image,
                    description: item.description,
                    category: "Agenda",
                }
            });
        } catch (e) {
            console.error(`❌ Failed import agenda ${item.slug}:`, e.message);
        }
    }
    console.log("✅ Agenda imported.");

    // 4. Import Leaders from JSON
    const leadersJson = getLeadersData();
    console.log(`📤 Importing ${leadersJson.length} Leaders from JSON...`);
    for (const l of leadersJson) {
        try {
            await prisma.leader.create({
                data: {
                    id: l.id,
                    name: l.name,
                    title: l.title,
                    titleEn: l.titleEn,
                    slug: l.slug,
                    image: l.image,
                    category: l.category,
                    email: l.email,
                    scholar: l.scholar,
                    vision: l.vision,
                    visionEn: l.visionEn,
                    education: JSON.stringify(l.education),
                    educationEn: JSON.stringify(l.educationEn),
                    career: JSON.stringify(l.career),
                    careerEn: JSON.stringify(l.careerEn),
                    research: JSON.stringify(l.research),
                    researchEn: JSON.stringify(l.researchEn),
                }
            });
        } catch (e) {
            console.error(`❌ Failed import leader ${l.slug}:`, e.message);
        }
    }
    console.log("✅ Leaders imported.");

    // Load Dump
    const dumpPath = path.join(process.cwd(), 'prisma', 'deep_migration_dump.json');
    let dumpData: any = {};
    if (fs.existsSync(dumpPath)) {
        dumpData = JSON.parse(fs.readFileSync(dumpPath, 'utf-8'));
    }

    // 5. Import Faculty
    // @ts-ignore
    const faculties = dumpData.faculty || [];
    console.log(`📤 Importing ${faculties.length} Faculties...`);
    for (const f of faculties) {
        try {
            await prisma.faculty.create({
                data: {
                    id: f.id,
                    name: f.name,
                    nameEn: f.nameEn,
                    slug: f.slug,
                    key: f.key,
                    icon: f.icon,
                    deanName: f.deanName,
                    deanTitle: f.deanTitle,
                    deanTitleEn: f.deanTitleEn,
                    deanMessage: f.deanMessage,
                    deanMessageEn: f.deanMessageEn,
                    deanImage: f.deanImage,
                    deanId: null, // Reset to null to avoid FK mismatch
                    vision: f.vision,
                    visionEn: f.visionEn,
                    missions: f.missions,
                    missionsEn: f.missionsEn,
                    heroImage: f.heroImage
                }
            });
        } catch (e) {
            console.error(`❌ Failed import faculty ${f.slug}:`, e.message);
        }
    }

    // 6. Import Programs
    const programs = dumpData.facultyProgram || [];
    console.log(`📤 Importing ${programs.length} Programs...`);
    for (const p of programs) {
        try {
            await prisma.facultyProgram.create({
                data: {
                    id: p.id,
                    name: p.name,
                    nameEn: p.nameEn,
                    slug: p.slug,
                    key: p.key,
                    level: p.level,
                    accreditation: p.accreditation,
                    facultyId: p.facultyId,
                    description: p.description,
                    descriptionEn: p.descriptionEn,
                    advantages: p.advantages,
                    advantagesEn: p.advantagesEn,
                    careerProspects: p.careerProspects,
                    careerProspectsEn: p.careerProspectsEn,
                    curriculumPdf: p.curriculumPdf
                }
            });
        } catch (e) {
            console.error(`❌ Failed import program ${p.slug}:`, e.message);
        }
    }

    // 7. Import Staff Categories
    const staffCategories = dumpData.staffCategory || [];
    console.log(`📤 Importing ${staffCategories.length} StaffCategories...`);
    for (const sc of staffCategories) {
        try {
            await prisma.staffCategory.create({
                data: {
                    id: sc.id,
                    name: sc.name,
                    nameEn: sc.nameEn,
                    slug: sc.slug,
                    order: sc.order
                }
            });
        } catch (e) {
            console.error(`❌ Failed import staffCategory ${sc.slug}:`, e.message);
        }
    }

    // 8. Import Staff
    // Need to make sure IDs match.
    const staff = dumpData.staff || [];
    console.log(`📤 Importing ${staff.length} Staff...`);
    for (const s of staff) {
        try {
            await prisma.staff.create({
                data: {
                    id: s.id,
                    name: s.name,
                    role: s.role,
                    roleEn: s.roleEn,
                    nidn: s.nidn,
                    image: s.image,
                    scholarUrl: s.scholarUrl,
                    categoryId: s.categoryId,
                    order: s.order
                }
            });
        } catch (e) {
            console.error(`❌ Failed import staff ${s.name}:`, e.message);
        }
    }

    // 9. Import Others (Research, PKM, etc.)
    // 9. Import Others (Research, PKM, etc.)
    const simpleTables = [
        ['lpmDocument', 'lpmDocument'],
        ['publication', 'publication'],
        ['researchProject', 'researchProject'],
        ['pkmProject', 'pkmProject'],
        ['researchConfig', 'researchConfig'],
        ['pkmConfig', 'pkmConfig'],
        ['laboratory', 'laboratory'],
        ['laboratoryConfig', 'laboratoryConfig'],
        ['lppmProfile', 'lppmProfile'],
        ['lppmStaff', 'lppmStaff'],
        ['pkmProgram', 'pkmProgram']
    ];

    // @ts-ignore
    for (const [dumpKey, model] of simpleTables) {
        const records = dumpData[dumpKey] || [];
        console.log(`📤 Importing ${records.length} ${model}...`);
        for (const r of records) {
            try {
                // Remove id if needed, but for configs we usually need specific IDs

                // For Configs (singleton), upsert or create is fine, but we deleted all first.
                // Just create should work.

                // @ts-ignore
                await prisma[model].create({ data: r });
            } catch (e) {
                console.log(`⚠️ Skip ${model} import: ${e.message}`);
            }
        }
    }

    console.log("\n🎉 MEGA IMPORT V3 COMPLETE!");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
