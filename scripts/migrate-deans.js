const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const dekanFakultasDetail = [
    {
        name: "Dr. Johariyah., M. Keb.",
        jabatan: "Dekan Fakultas Ilmu Kesehatan",
        foto: "/images/pimpinan/dekan1.png",
        category: "Dekan",
        slug: "johariyah",
        facultyKey: "health"
    },
    {
        name: "Dr. apt. Yuhansyah Nurfauzi, M.Si.",
        jabatan: "Dekan Fakultas Farmasi, Sains & Teknologi",
        foto: "/images/pimpinan/dekan2.png",
        category: "Dekan",
        slug: "yuhansyah-nurfauzi",
        facultyKey: "science"
    },
    {
        name: "Dr Opi Irawansyah, M.PdI.",
        jabatan: "Dekan Fakultas Ekonomi & Bisnis",
        foto: "/images/pimpinan/dekan3.png",
        category: "Dekan",
        slug: "opi-irawansyah",
        facultyKey: "business"
    }
];

// Education/Career/Research data extracted from pimpinan.ts for these deans
const extraData = {
    "johariyah": {
        education: ["S1 Kebidanan - Universitas Gadjah Mada (2006)", "S2 Kesehatan Reproduksi - Universitas Indonesia (2011)", "S3 Kesehatan Masyarakat - Universitas Diponegoro (2016)"],
        career: ["Bidan di RSUD Cilacap (2006-2011)", "Dosen Fakultas Ilmu Kesehatan UNAIC (2011-sekarang)", "Kepala Program Studi Kebidanan (2013-2018)", "Dekan Fakultas Ilmu Kesehatan UNAIC (2018-sekarang)"],
        research: ["Epidemiologi Kesehatan Reproduksi Remaja", "Program Kesehatan Sekolah di Daerah Terpencil", "Pengembangan Model Deteksi Dini Kanker Serviks"]
    },
    "yuhansyah-nurfauzi": {
        education: ["S1 Farmasi - Institut Teknologi Bandung (2007)", "S2 Kimia Farmasi - Universitas Indonesia (2012)", "S3 Farmakognosi - Universitas Gadjah Mada (2017)"],
        career: ["Peneliti di Balai Penelitian Tanaman Obat (2007-2012)", "Dosen Fakultas Farmasi UNAIC (2012-sekarang)", "Kepala Laboratorium Farmakognosi (2015-2018)", "Dekan Fakultas Farmasi, Sains & Teknologi UNAIC (2018-sekarang)"],
        research: ["Isolasi dan Identifikasi Senyawa Bioaktif dari Tanaman Obat", "Pengembangan Fitofarmaka untuk Penyakit Degeneratif", "Studi Etnofarmakologi Masyarakat Adat"]
    },
    "opi-irawansyah": {
        education: ["S1 Ekonomi Islam - Universitas Islam Indonesia (2008)", "S2 Ekonomi Syariah - Universitas Muhammadiyah Yogyakarta (2013)", "S3 Pendidikan Islam - Universitas Negeri Yogyakarta (2018)"],
        career: ["Pengajar di Madrasah Aliyah (2008-2013)", "Dosen Fakultas Ekonomi & Bisnis UNAIC (2013-sekarang)", "Kepala Program Studi Ekonomi Syariah (2015-2018)", "Dekan Fakultas Ekonomi & Bisnis UNAIC (2018-sekarang)"],
        research: ["Pengembangan Model Bisnis Syariah di Era Digital", "Studi Perilaku Konsumen Muslim Modern", "Implementasi Ekonomi Islam dalam Pembangunan Berkelanjutan"]
    }
};

async function main() {
    console.log('Starting migration for Leaders (Deans)...');

    for (const dekan of dekanFakultasDetail) {
        const extra = extraData[dekan.slug];

        const leader = await prisma.leader.upsert({
            where: { slug: dekan.slug },
            update: {
                name: dekan.name,
                title: dekan.jabatan,
                image: dekan.foto,
                category: dekan.category,
                education: JSON.stringify(extra.education),
                career: JSON.stringify(extra.career),
                research: JSON.stringify(extra.research),
            },
            create: {
                name: dekan.name,
                title: dekan.jabatan,
                image: dekan.foto,
                category: dekan.category,
                slug: dekan.slug,
                education: JSON.stringify(extra.education),
                career: JSON.stringify(extra.career),
                research: JSON.stringify(extra.research),
            }
        });

        console.log(`Migrated Leader: ${leader.name}`);

        // Link to Faculty
        await prisma.faculty.update({
            where: { key: dekan.facultyKey },
            data: { deanId: leader.id }
        });
        console.log(`Linked ${leader.name} to Faculty ${dekan.facultyKey}`);
    }

    console.log('Migration completed.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
