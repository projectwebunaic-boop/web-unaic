export interface AccreditationHistory {
    id: string;
    year: string;
    institutionName: string;
    description: string;
    docTitle: string;
    docNumber: string;
    downloadUrl: string;
    status: "current" | "archived";
}

export interface ProgramAccreditation {
    id: string;
    faculty: string;
    program: string;
    level: "D3" | "D4" | "S1" | "Profesi";
    rank: "Unggul" | "A" | "Baik Sekali" | "B" | "Baik";
    skNumber: string;
    expiryDate: string;
    downloadUrl: string;
}

export const institutionHistory: AccreditationHistory[] = [
    {
        id: "unaic-2024",
        year: "2021 - Sekarang",
        institutionName: "Universitas Al-Irsyad Cilacap (UNAIC)",
        description: "Transformasi menjadi Universitas berdasarkan SK Kemendikbud Ristek. Institusi terakreditasi dengan peringkat BAIK SEKALI.",
        docTitle: "Sertifikat Akreditasi Institusi (APT)",
        docNumber: "No. 123/SK/BAN-PT/Ak-PPj/PT/V/2021",
        downloadUrl: "#",
        status: "current",
    },
    {
        id: "stikes-2010",
        year: "2006 - 2021",
        institutionName: "STIKES Al-Irsyad Al-Islamiyyah",
        description: "Perubahan bentuk menjadi Sekolah Tinggi Ilmu Kesehatan dengan penambahan prodi Sarjana.",
        docTitle: "SK Pendirian STIKES",
        docNumber: "No. 456/D/O/2006",
        downloadUrl: "#",
        status: "archived",
    },
    {
        id: "akper-1995",
        year: "1995 - 2006",
        institutionName: "Akademi Keperawatan (AKPER) Al-Irsyad",
        description: "Berdiri sebagai Akademi Keperawatan pertama di Cilacap yang mencetak tenaga perawat profesional.",
        docTitle: "SK Pendirian AKPER",
        docNumber: "No. 789/Dikti/Kep/1995",
        downloadUrl: "#",
        status: "archived",
    },
];

export const programAccreditations: ProgramAccreditation[] = [
    // Fakultas Ilmu Kesehatan
    {
        id: "fikes-1",
        faculty: "Fakultas Ilmu Kesehatan",
        program: "Keperawatan",
        level: "D3",
        rank: "Unggul",
        skNumber: "001/LAM-PTKes/Akr/Dip/IX/2023",
        expiryDate: "2028-09-01",
        downloadUrl: "#",
    },
    {
        id: "fikes-2",
        faculty: "Fakultas Ilmu Kesehatan",
        program: "Kebidanan",
        level: "D3",
        rank: "Baik Sekali",
        skNumber: "002/LAM-PTKes/Akr/Dip/IX/2023",
        expiryDate: "2028-09-01",
        downloadUrl: "#",
    },
    {
        id: "fikes-3",
        faculty: "Fakultas Ilmu Kesehatan",
        program: "Keperawatan",
        level: "S1",
        rank: "Baik Sekali",
        skNumber: "003/LAM-PTKes/Akr/Sar/IX/2023",
        expiryDate: "2028-09-01",
        downloadUrl: "#",
    },
    {
        id: "fikes-4",
        faculty: "Fakultas Ilmu Kesehatan",
        program: "Ners",
        level: "Profesi",
        rank: "Baik Sekali",
        skNumber: "004/LAM-PTKes/Akr/Pro/IX/2023",
        expiryDate: "2028-09-01",
        downloadUrl: "#",
    },

    // Fakultas Farmasi, Sains & Teknologi
    {
        id: "ffst-1",
        faculty: "Fakultas Farmasi, Sains & Teknologi",
        program: "Farmasi",
        level: "D3",
        rank: "Baik Sekali",
        skNumber: "005/LAM-PTKes/Akr/Dip/X/2023",
        expiryDate: "2028-10-01",
        downloadUrl: "#",
    },
    {
        id: "ffst-2",
        faculty: "Fakultas Farmasi, Sains & Teknologi",
        program: "Farmasi",
        level: "S1",
        rank: "Baik",
        skNumber: "006/LAM-PTKes/Akr/Sar/X/2023",
        expiryDate: "2028-10-01",
        downloadUrl: "#",
    },

    // Fakultas Ekonomi & Bisnis
    {
        id: "feb-1",
        faculty: "Fakultas Ekonomi & Bisnis",
        program: "Bisnis Digital",
        level: "S1",
        rank: "Baik",
        skNumber: "007/BAN-PT/Akr/Sar/XI/2023",
        expiryDate: "2028-11-01",
        downloadUrl: "#",
    },
    {
        id: "feb-2",
        faculty: "Fakultas Ekonomi & Bisnis",
        program: "Kewirausahaan",
        level: "S1",
        rank: "Baik",
        skNumber: "008/BAN-PT/Akr/Sar/XI/2023",
        expiryDate: "2028-11-01",
        downloadUrl: "#",
    },
];
