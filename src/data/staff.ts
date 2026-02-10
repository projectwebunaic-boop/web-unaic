export interface StaffMember {
  id: string;
  name: string;
  position: string;
  unit: string;
  image: string;
  category: 'dosen' | 'karyawan';
  slug?: string;
}

export const staffData: StaffMember[] = [
  // Dosen data (from existing dosen.ts)
  {
    id: "sarwa",
    name: "Sarwa, AMK., S.Pd., M.Kes.",
    position: "Rektor Universitas Al-Irsyad Cilacap",
    unit: "Rektorat",
    image: "/images/dosen/sarwa.jpg",
    category: "dosen",
    slug: "sarwa"
  },
  {
    id: "mika-tri-kumala-swandari",
    name: "apt. Mika Tri Kumala Swandari, M.Sc",
    position: "Wakil Rektor I",
    unit: "Rektorat",
    image: "/images/dosen/mika.jpg",
    category: "dosen",
    slug: "mika-tri-kumala-swandari"
  },
  {
    id: "yogi-andhi-lestari",
    name: "Yogi Andhi Lestari, S.ST., M.Keb.",
    position: "Wakil Rektor II",
    unit: "Rektorat",
    image: "/images/dosen/yogi.jpg",
    category: "dosen",
    slug: "yogi-andhi-lestari"
  },
  {
    id: "agus-prasetyo",
    name: "Agus Prasetyo, M.Kep., Ns.",
    position: "Wakil Rektor III",
    unit: "Rektorat",
    image: "/images/dosen/agus.jpg",
    category: "dosen",
    slug: "agus-prasetyo"
  },
  {
    id: "johariyah",
    name: "Dr. Johariyah., M. Keb.",
    position: "Dekan Fakultas Ilmu Kesehatan",
    unit: "Fakultas Ilmu Kesehatan",
    image: "/images/dosen/johariyah.jpg",
    category: "dosen",
    slug: "johariyah"
  },
  {
    id: "nurfauzi",
    name: "Dr. apt. Yuhansyah Nurfauzi, M.Si.",
    position: "Dekan Fakultas Farmasi, Sains & Teknologi",
    unit: "Fakultas Farmasi, Sains & Teknologi",
    image: "/images/dosen/nurfauzi.jpg",
    category: "dosen",
    slug: "nurfauzi"
  },
  {
    id: "opi-irawansyah",
    name: "Dr Opi Irawansyah, M.PdI.",
    position: "Dekan Fakultas Ekonomi & Bisnis",
    unit: "Fakultas Ekonomi & Bisnis",
    image: "/images/dosen/opi.jpg",
    category: "dosen",
    slug: "opi-irawansyah"
  },
  // Karyawan data
  {
    id: "siti-aminah",
    name: "Siti Aminah, S.E.",
    position: "Kepala Bagian Keuangan",
    unit: "Bagian Keuangan",
    image: "/images/staff/siti-aminah.jpg",
    category: "karyawan"
  },
  {
    id: "ahmad-susanto",
    name: "Ahmad Susanto, S.Kom.",
    position: "Kepala Bagian IT",
    unit: "Bagian Sistem Informasi",
    image: "/images/staff/ahmad-susanto.jpg",
    category: "karyawan"
  },
  {
    id: "rini-wulandari",
    name: "Rini Wulandari, S.Pd.",
    position: "Kepala Bagian Akademik",
    unit: "Bagian Akademik",
    image: "/images/staff/rini-wulandari.jpg",
    category: "karyawan"
  },
  {
    id: "budi-setiawan",
    name: "Budi Setiawan, S.E.",
    position: "Kepala Bagian Umum",
    unit: "Bagian Umum",
    image: "/images/staff/budi-setiawan.jpg",
    category: "karyawan"
  },
  {
    id: "maya-sari",
    name: "Maya Sari, S.Pd.",
    position: "Kepala Bagian Kemahasiswaan",
    unit: "Bagian Kemahasiswaan",
    image: "/images/staff/maya-sari.jpg",
    category: "karyawan"
  },
  {
    id: "dwi-rahayu",
    name: "Dwi Rahayu, S.E.",
    position: "Kepala Bagian Kepegawaian",
    unit: "Bagian Kepegawaian",
    image: "/images/staff/dwi-rahayu.jpg",
    category: "karyawan"
  },
  {
    id: "eko-prasetyo",
    name: "Eko Prasetyo, S.Kom.",
    position: "Kepala Bagian Perpustakaan",
    unit: "Perpustakaan",
    image: "/images/staff/eko-prasetyo.jpg",
    category: "karyawan"
  },
  {
    id: "linda-kusuma",
    name: "Linda Kusuma, S.Pd.",
    position: "Kepala Bagian Laboratorium",
    unit: "Laboratorium",
    image: "/images/staff/linda-kusuma.jpg",
    category: "karyawan"
  }
];
