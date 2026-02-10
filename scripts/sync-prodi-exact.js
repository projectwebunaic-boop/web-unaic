const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const FIKES_ID = '66ca1649-1868-4ae1-967c-39234d91b041';
const FASTEK_ID = 'b99b12ce-96af-4eff-9922-95feed8bc253';
const FEB_ID = '2ea5b89d-7ac2-41dd-9b97-4ad582139073';

const TARGET_PROGRAMS = [
    // FIKES
    { facultyId: FIKES_ID, slug: 's1-nursing', name: 'S1 Ilmu Keperawatan', nameEn: 'S1 Nursing Science', level: 'S1', accreditation: 'Baik Sekali' },
    { facultyId: FIKES_ID, slug: 's1-midwifery', name: 'S1 Kebidanan', nameEn: 'S1 Midwifery', level: 'S1', accreditation: 'Baik' },
    { facultyId: FIKES_ID, slug: 's1-physio', name: 'S1 Fisioterapi', nameEn: 'S1 Physiotherapy', level: 'S1', accreditation: 'Baik' },
    { facultyId: FIKES_ID, slug: 'd3-nursing', name: 'D3 Keperawatan', nameEn: 'D3 Nursing', level: 'D3', accreditation: 'Baik Sekali' },
    { facultyId: FIKES_ID, slug: 'prof-midwife', name: 'Profesi Bidan', nameEn: 'Midwife Profession', level: 'Profesi', accreditation: 'Baik' },
    { facultyId: FIKES_ID, slug: 'prof-nurse', name: 'Profesi Ners', nameEn: 'Nurse Profession', level: 'Profesi', accreditation: 'Baik Sekali' },

    // FASTEK
    { facultyId: FASTEK_ID, slug: 's1-pharmacy', name: 'S1 Farmasi', nameEn: 'S1 Pharmacy', level: 'S1', accreditation: 'Baik' },
    { facultyId: FASTEK_ID, slug: 's1-informatics', name: 'S1 Informatika', nameEn: 'S1 Informatics', level: 'S1', accreditation: 'Baik' },
    { facultyId: FASTEK_ID, slug: 'd4-tlm', name: 'D4 Teknologi Laboratorium Medis', nameEn: 'D4 Medical Laboratory Technology', level: 'D4', accreditation: 'Baik Sekali' },
    { facultyId: FASTEK_ID, slug: 'd3-pharmacy', name: 'D3 Farmasi', nameEn: 'D3 Pharmacy', level: 'D3', accreditation: 'A' },
    { facultyId: FASTEK_ID, slug: 'prof-apothecary', name: 'Profesi Apoteker', nameEn: 'Apothecary Profession', level: 'Profesi', accreditation: 'Baik' },

    // FEB
    { facultyId: FEB_ID, slug: 's1-digital-business', name: 'S1 Bisnis Digital', nameEn: 'S1 Digital Business', level: 'S1', accreditation: 'Baik' },
    { facultyId: FEB_ID, slug: 's1-entrepreneurship', name: 'S1 Kewirausahaan', nameEn: 'S1 Entrepreneurship', level: 'S1', accreditation: 'Baik' }
];

async function main() {
    try {
        console.log('--- Starting Precise Program Sync ---');

        // 1. Get current programs
        const allPrograms = await prisma.facultyProgram.findMany();
        const targetSlugs = TARGET_PROGRAMS.map(p => p.slug);

        // 2. Delete programs NOT in the target list
        const toDelete = allPrograms.filter(p => !targetSlugs.includes(p.slug));
        if (toDelete.length > 0) {
            await prisma.facultyProgram.deleteMany({
                where: { id: { in: toDelete.map(p => p.id) } }
            });
            console.log(`Deleted ${toDelete.length} legacy/extra programs.`);
        }

        // 3. Upsert target programs
        for (const p of TARGET_PROGRAMS) {
            const key = p.slug.replace(/-/g, '_');
            await prisma.facultyProgram.upsert({
                where: { key },
                update: {
                    name: p.name,
                    nameEn: p.nameEn,
                    slug: p.slug,
                    level: p.level,
                    accreditation: p.accreditation,
                    facultyId: p.facultyId
                },
                create: {
                    key,
                    name: p.name,
                    nameEn: p.nameEn,
                    slug: p.slug,
                    level: p.level,
                    accreditation: p.accreditation,
                    facultyId: p.facultyId
                }
            });
            console.log(`Synced: ${p.name}`);
        }

        console.log('--- Sync Finished ---');
    } catch (error) {
        console.error('Error during sync:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
