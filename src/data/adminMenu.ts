import {
    LayoutDashboard,
    MessageSquare,
    Bot,
    Settings,
    Calendar,
    Users,
    BookOpen,
    Target,
    FlaskConical,
    Handshake,
    GraduationCap,
    Briefcase,
    ShieldCheck,
    School,
    Building,
    Award,
    FileCheck,
    Newspaper,
    CalendarDays,
    FileText,
    Home,
    MapPin
} from "lucide-react";

export interface MenuItem {
    title: string;
    href: string;
    icon: any;
    match?: "exact" | "startsWith";
    description?: string; // Added for Dashboard Cards
    color?: string;       // Added for Dashboard Cards
}

export interface MenuGroup {
    groupName: string;
    items: MenuItem[];
}

export const adminMenuGroups: MenuGroup[] = [
    {
        groupName: "Menu Utama",
        items: [
            {
                title: "Dashboard",
                href: "/admin",
                icon: LayoutDashboard,
                match: "exact",
                description: "Pusat kendali utama",
                color: "bg-blue-100 text-blue-600"
            }
        ]
    },
    {
        groupName: "Tentang Kampus",
        items: [
            {
                title: "Kelola Beranda",
                href: "/admin/homepage",
                icon: Home,
                description: "Edit konten halaman depan",
                color: "bg-blue-100 text-blue-600"
            },
            {
                title: "Profil Kampus",
                href: "/admin/profile",
                icon: School,
                description: "Kelola sejarah, visi misi",
                color: "bg-indigo-100 text-indigo-600"
            },
            {
                title: "Fasilitas Kampus",
                href: "/admin/facilities",
                icon: Building,
                description: "Daftar fasilitas & gedung",
                color: "bg-cyan-100 text-cyan-600"
            },
            {
                title: "Manajemen Prestasi",
                href: "/admin/achievements",
                icon: Award,
                description: "Data prestasi mahasiswa",
                color: "bg-yellow-100 text-yellow-600"
            },
            {
                title: "Manajemen Mitra",
                href: "/admin/partners",
                icon: Handshake,
                description: "Kerjasama institusi",
                color: "bg-sky-100 text-sky-600"
            },
            {
                title: "Manajemen Akreditasi",
                href: "/admin/accreditation",
                icon: FileCheck,
                description: "Status akreditasi prodi",
                color: "bg-green-100 text-green-600"
            }
        ]
    },
    {
        groupName: "Manajemen & Biro",
        items: [
            {
                title: "Manajemen Pimpinan",
                href: "/admin/leaders",
                icon: Users,
                description: "Struktur pimpinan",
                color: "bg-pink-100 text-pink-600"
            },
            {
                title: "Manajemen SDM",
                href: "/admin/sdm",
                icon: Users,
                description: "Sumber Daya Manusia",
                color: "bg-lime-100 text-lime-600"
            },
            {
                title: "Manajemen BAAK",
                href: "/admin/baak",
                icon: GraduationCap,
                description: "Biro Akademik",
                color: "bg-violet-100 text-violet-600"
            },
            {
                title: "Manajemen BAUKK",
                href: "/admin/baukk",
                icon: Briefcase,
                description: "Biro Administrasi Umum",
                color: "bg-stone-100 text-stone-600"
            },
            {
                title: "Jaminan Mutu (LJM)",
                href: "/admin/lpm",
                icon: ShieldCheck,
                description: "Lembaga Penjaminan Mutu",
                color: "bg-fuchsia-100 text-fuchsia-600"
            }
        ]
    },
    {
        groupName: "Fakultas & Prodi",
        items: [
            {
                title: "Manajemen Fakultas",
                href: "/admin/faculties",
                icon: GraduationCap,
                description: "Kelola detail fakultas",
                color: "bg-blue-100 text-blue-600"
            }
        ]
    },
    {
        groupName: "Akademik",
        items: [
            {
                title: "Kalender Akademik",
                href: "/admin/calendar",
                icon: Calendar,
                description: "Agenda akademik tahunan",
                color: "bg-amber-100 text-amber-600"
            },
            {
                title: "Kebijakan Akademik",
                href: "/admin/policies",
                icon: FileText,
                description: "Daftar aturan & pedoman",
                color: "bg-slate-100 text-slate-600"
            },
            {
                title: "Manajemen Perpustakaan",
                href: "/admin/library",
                icon: BookOpen,
                description: "Portal & layanan perpustakaan",
                color: "bg-blue-100 text-blue-600"
            },
            {
                title: "Manajemen Laboratorium",
                href: "/admin/laboratorium",
                icon: FlaskConical,
                description: "Fasilitas & alat laboratorium",
                color: "bg-emerald-100 text-emerald-600"
            }
        ]
    },
    {
        groupName: "Kemahasiswaan",
        items: [
            {
                title: "Bagian Kemahasiswaan",
                href: "/admin/kemahasiswaan-bagian",
                icon: Users,
                description: "Profil & Layanan Mhs",
                color: "bg-blue-100 text-blue-600"
            },
            {
                title: "Kegiatan Mahasiswa",
                href: "/admin/activities",
                icon: Calendar,
                description: "Aktivitas harian mhs",
                color: "bg-rose-100 text-rose-600"
            },
            {
                title: "Manajemen Beasiswa",
                href: "/admin/scholarships",
                icon: GraduationCap,
                description: "Program beasiswa aktif",
                color: "bg-emerald-100 text-emerald-600"
            },
            {
                title: "Manajemen Organisasi",
                href: "/admin/organizations",
                icon: Users,
                description: "Ormawa & UKM",
                color: "bg-purple-100 text-purple-600"
            },
            {
                title: "Manajemen Alumni",
                href: "/admin/alumni",
                icon: GraduationCap,
                description: "Data & cerita alumni",
                color: "bg-teal-100 text-teal-600"
            }
        ]
    },
    {
        groupName: "Berita & Agenda",
        items: [
            {
                title: "Manajemen Berita",
                href: "/admin/news",
                icon: Newspaper,
                description: "Artikel & Berita terbaru",
                color: "bg-red-100 text-red-600"
            },
            {
                title: "Manajemen Agenda",
                href: "/admin/agenda",
                icon: CalendarDays,
                description: "Kalender kegiatan kampus",
                color: "bg-orange-100 text-orange-600"
            }
        ]
    },
    {
        groupName: "Riset & Inovasi",
        items: [
            {
                title: "Profil LPPM",
                href: "/admin/lppm",
                icon: Target,
                description: "Lembaga Penelitian",
                color: "bg-teal-100 text-teal-600"
            },
            {
                title: "Manajemen Penelitian",
                href: "/admin/research",
                icon: FlaskConical,
                description: "Data riset dosen",
                color: "bg-indigo-100 text-indigo-600"
            },
            {
                title: "Manajemen Pengabdian",
                href: "/admin/pkm",
                icon: Handshake,
                description: "Pengabdian masyarakat",
                color: "bg-orange-100 text-orange-600"
            },
            {
                title: "Publikasi",
                href: "/admin/publications",
                icon: BookOpen,
                description: "Jurnal & Publikasi",
                color: "bg-pink-100 text-pink-600"
            }
        ]
    },
    {
        groupName: "Layanan & Sistem",
        items: [
            {
                title: "Manajemen FAQ",
                href: "/admin/faq",
                icon: MessageSquare,
                description: "Tanya jawab umum",
                color: "bg-blue-200 text-blue-700"
            },
            {
                title: "Layanan Aduan",
                href: "/admin/aduan",
                icon: MessageSquare,
                description: "Kotak saran & aduan",
                color: "bg-red-100 text-red-600"
            },
            {
                title: "Kontak & Lokasi",
                href: "/admin/contacts",
                icon: MapPin,
                description: "Alamat & Kontak",
                color: "bg-cyan-100 text-cyan-600"
            },
            {
                title: "Upload Brosur",
                href: "/admin/brochure",
                icon: FileText,
                description: "Update file brosur PMB",
                color: "bg-violet-100 text-violet-600"
            },
            {
                title: "Chatbot AI",
                href: "/admin/chatbot",
                icon: Bot,
                description: "Konfigurasi Assistant",
                color: "bg-emerald-100 text-emerald-600"
            },
            {
                title: "Pengaturan",
                href: "/admin/settings",
                icon: Settings,
                description: "Konfigurasi Admin",
                color: "bg-slate-200 text-slate-700"
            }
        ]
    }
];
