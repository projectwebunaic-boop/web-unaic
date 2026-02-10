
import { Building2, Globe, Handshake, Hospital, Landmark, GraduationCap } from 'lucide-react';
import React from 'react';

export interface Partner {
    slug: string;
    name: string;
    category: "Pelayanan Kesehatan" | "Institusi Pendidikan" | "Industri & Perusahaan" | "Instansi Pemerintah";
    description: string; // Short description for the list
    profile: string; // Full profile for the detail page
    images: string[]; // Array of image URLs for documentation
    mouDocument?: string; // URL to the PDF/Document
    website?: string;
}

export const PARTNER_CATEGORIES = [
    {
        name: "Pelayanan Kesehatan",
        iconName: "Hospital",
        description: "Kerjasama praktik klinik dan pengembangan karir tenaga kesehatan."
    },
    {
        name: "Institusi Pendidikan",
        iconName: "GraduationCap",
        description: "Kolaborasi riset, pertukaran pelajar, dan studi lanjut."
    },
    {
        name: "Industri & Perusahaan",
        iconName: "Building2",
        description: "Program magang, penyerapan lulusan, dan hilirisasi inovasi."
    },
    {
        name: "Instansi Pemerintah",
        iconName: "Landmark",
        description: "Sinergi program pengabdian masyarakat dan pengembangan daerah."
    }
] as const;

export const partners: Partner[] = [
    // Pelayanan Kesehatan
    {
        slug: "rsud-cilacap",
        name: "RSUD Cilacap",
        category: "Pelayanan Kesehatan",
        description: "Rumah Sakit Umum Daerah kebanggaan Kabupaten Cilacap.",
        profile: "RSUD Cilacap adalah rumah sakit rujukan utama di Kabupaten Cilacap yang berkomitmen memberikan pelayanan kesehatan paripurna. Kerjasama dengan UNAIC meliputi praktik klinik mahasiswa keperawatan, kebidanan, dan farmasi, serta penelitian bersama dosen dan tenaga medis.",
        images: [
            "https://placehold.co/800x600/1e3a8a/ffffff?text=MoU+Signing",
            "https://placehold.co/800x600/1e3a8a/ffffff?text=Kunjungan+Industri",
            "https://placehold.co/800x600/1e3a8a/ffffff?text=Praktik+Mahasiswa"
        ],
        mouDocument: "/documents/mou-rsud-cilacap-dummy.pdf",
        website: "https://rsud.cilacapkab.go.id"
    },
    {
        slug: "rsi-fatimah-cilacap",
        name: "RSI Fatimah Cilacap",
        category: "Pelayanan Kesehatan",
        description: "Rumah Sakit Islam dengan pelayanan unggulan dan modern.",
        profile: "RSI Fatimah Cilacap merupakan mitra strategis UNAIC dalam penyelenggaraan pendidikan kesehatan berbasis nilai-nilai Islam. Kerjasama mencakup penyediaan lahan praktik, rekrutmen lulusan, dan kegiatan sosial kemasyarakatan.",
        images: [
            "https://placehold.co/800x600/166534/ffffff?text=Foto+Bersama",
            "https://placehold.co/800x600/166534/ffffff?text=Kegiatan+Ilmiah"
        ],
        mouDocument: "/documents/mou-rsi-fatimah.pdf"
    },

    // Institusi Pendidikan
    {
        slug: "unsoed",
        name: "Universitas Jenderal Soedirman",
        category: "Institusi Pendidikan",
        description: "Perguruan tinggi negeri terkemuka di Purwokerto.",
        profile: "Kerjasama dengan Universitas Jenderal Soedirman (Unsoed) meliputi kolaborasi riset antar dosen, seminar internasional bersama, dan pendampingan akreditasi. Unsoed menjadi mitra strategis dalam pengembangan mutu akademik UNAIC.",
        images: [
            "https://placehold.co/800x600/ea580c/ffffff?text=MoU+Unsoed"
        ],
        website: "https://unsoed.ac.id"
    },
    {
        slug: "msu-malaysia",
        name: "Management and Science University (MSU) Malaysia",
        category: "Institusi Pendidikan",
        description: "Mitra internasional untuk pertukaran pelajar dan dosen.",
        profile: "Management and Science University (MSU) adalah salah satu universitas swasta terkemuka di Malaysia. Kerjasama ini membuka peluang bagi mahasiswa UNAIC untuk mengikuti program pertukaran pelajar, double degree, dan bagi dosen untuk melakukan visiting lecturer.",
        images: [
            "https://placehold.co/800x600/7e22ce/ffffff?text=International+Partnership"
        ],
        website: "https://msu.edu.my"
    },

    // Industri
    {
        slug: "pertamina-cilacap",
        name: "PT Pertamina (Persero) RU IV Cilacap",
        category: "Industri & Perusahaan",
        description: "Kilang minyak terbesar di Indonesia yang berlokasi di Cilacap.",
        profile: "PT Pertamina RU IV Cilacap mendukung program pendidikan UNAIC melalui penyediaan tempat magang, kuliah umum dari praktisi industri, dan dukungan beasiswa/CSR bagi mahasiswa berprestasi.",
        images: [
            "https://placehold.co/800x600/b91c1c/ffffff?text=Kunjungan+Kilang"
        ],
        mouDocument: "/documents/mou-pertamina.pdf"
    },

    // Pemerintah
    {
        slug: "pemkab-cilacap",
        name: "Pemerintah Kabupaten Cilacap",
        category: "Instansi Pemerintah",
        description: "Sinergi pembangunan daerah melalui pendidikan.",
        profile: "UNAIC bekerjasama erat dengan Pemerintah Kabupaten Cilacap dalam berbagai program pembangunan daerah, khususnya di bidang kesehatan masyarakat, pengentasan stunting, dan pengembangan sumber daya manusia.",
        images: [
            "https://placehold.co/800x600/0f766e/ffffff?text=Audiensi+Bupati"
        ],
        website: "https://cilacapkab.go.id"
    }
];
