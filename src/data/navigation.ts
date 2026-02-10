import { faculties } from "@/data/faculties";

export interface NavigationItem {
  title: string;
  href?: string;
  key?: string; // Translation key
  submenu?: NavigationItem[];
}

export const navigation: NavigationItem[] = [
  {
    title: "Tentang",
    key: "Navigation.menu.about",
    submenu: [
      { title: "Profil", href: "/tentang/profil", key: "Navigation.submenu.profile" },
      { title: "Sejarah", href: "/tentang/sejarah", key: "Navigation.submenu.history" },
      { title: "Visi & Misi", href: "/tentang/visi-misi", key: "Navigation.submenu.vision" },
      { title: "Fasilitas", href: "/tentang/fasilitas", key: "Navigation.submenu.facilities" },
      { title: "Prestasi", href: "/tentang/prestasi", key: "Navigation.submenu.achievements" },
      { title: "Mitra & Kerjasama", href: "/tentang/mitra", key: "Navigation.submenu.cooperation" },
      { title: "Akreditasi & Legalitas", href: "/tentang/akreditasi", key: "Navigation.submenu.accreditation" },
    ],
  },
  {
    title: "Manajemen",
    key: "Navigation.menu.management",
    submenu: [
      { title: "Pimpinan", href: "/manajemen/pimpinan", key: "Navigation.submenu.leaders" },
      { title: "BAAK", href: "/manajemen/baak", key: "Navigation.submenu.baak" },
      { title: "BAUKK", href: "/manajemen/baukk", key: "Navigation.submenu.baukk" },
      { title: "LJM (Jaminan Mutu)", href: "/manajemen/penjaminan-mutu", key: "Navigation.submenu.lpm" },
      { title: "Dosen & Tendik", href: "/manajemen/dosen-tendik", key: "Navigation.submenu.lecturers" },
    ],
  },
  {
    title: "Fakultas & Prodi",
    key: "Navigation.menu.faculties",
    submenu: faculties.map((faculty) => ({
      title: faculty.name,
      href: faculty.link,
      key: `Faculties.${faculty.key}.name`, // Root level access for Faculties
      submenu: faculty.programs.map((program) => ({
        title: program.name,
        href: `${faculty.link}/${program.slug}`,
        key: `Faculties.${faculty.key}.programs.${program.key}`,
      })),
    })),
  },
  {
    title: "Akademik",
    key: "Navigation.menu.academic",
    submenu: [
      { title: "Kurikulum", href: "/akademik/kurikulum", key: "Navigation.submenu.curriculum" },
      { title: "Kalender Akademik", href: "/akademik/kalender", key: "Navigation.submenu.calendar" },
      { title: "Kebijakan Akademik", href: "/akademik/kebijakan", key: "Navigation.submenu.policy" },
      { title: "Perpustakaan", href: "/akademik/perpustakaan", key: "Navigation.submenu.library" },
      { title: "Laboratorium", href: "/akademik/laboratorium", key: "Navigation.submenu.lab" },
    ],
  },
  {
    title: "Riset & Inovasi",
    key: "Navigation.menu.research",
    submenu: [
      { title: "Profil LPPM", href: "/riset-inovasi/lppm", key: "Navigation.submenu.lppm" },
      { title: "Penelitian & HKI", href: "/riset-inovasi/penelitian", key: "Navigation.submenu.research" },
      { title: "Pengabdian Masyarakat", href: "/riset-inovasi/pengabdian", key: "Navigation.submenu.pkm" },
      { title: "Publikasi", href: "/riset-inovasi/publikasi", key: "Navigation.submenu.publication" },
    ],
  },
  {
    title: "Kemahasiswaan",
    key: "Navigation.menu.student",
    submenu: [
      { title: "Bagian Kemahasiswaan", href: "/kemahasiswaan/bagian", key: "Navigation.submenu.student_dept" },
      { title: "Kegiatan Mahasiswa", href: "/kemahasiswaan/kegiatan", key: "Navigation.submenu.activities" },
      { title: "Beasiswa", href: "/kemahasiswaan/beasiswa", key: "Navigation.submenu.scholarship" },
      { title: "Organisasi Mahasiswa", href: "/kemahasiswaan/organisasi", key: "Navigation.submenu.organizations" },
      { title: "Alumni & Karir", href: "/alumni-karir", key: "Navigation.submenu.career" },
    ],
  },
  {
    title: "Berita & Agenda",
    key: "Navigation.menu.news",
    submenu: [
      { title: "Berita", href: "/berita-agenda/berita", key: "Navigation.submenu.news" },
      { title: "Agenda", href: "/berita-agenda/agenda", key: "Navigation.submenu.agenda" },
    ],
  },
  {
    title: "FAQ",
    href: "/faq",
    key: "Navigation.menu.faq"
  },
];
