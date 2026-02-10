import { NewsItem, NewsCategory } from "@/types/news";
import { agenda } from "./agenda";


// Base News Data (Manual Entries)
const rawNews: NewsItem[] = [
  {
    id: "1",
    title: "UNAIC Luncurkan Program Beasiswa 2025",
    slug: "unaic-luncurkan-beasiswa-2025",
    date: "20 Oktober 2025",
    author: "Humas UNAIC",
    category: "Pengumuman", // Changed from Beasiswa to Pengumuman
    thumbnail: "/uploads/1768635270029_WhatsApp_Image_2025-12-01_at_10.23.27_383a8544.jpg",
    excerpt: "Universitas Al-Irsyad Cilacap (UNAIC) kembali membuka program Beasiswa UNAIC 2025 bagi calon mahasiswa berprestasi...",
    content: `
      <p>Universitas Al-Irsyad Cilacap (UNAIC) kembali membuka program Beasiswa UNAIC 2025 bagi calon mahasiswa berprestasi...</p>
      <p>Program ini bertujuan untuk memberikan kesempatan lebih luas bagi generasi muda dalam menempuh pendidikan tinggi berkualitas di UNAIC.</p>
    `,
    isFeatured: true,
  },
  {
    id: "2",
    title: "UNAIC Perkuat Kerjasama Riset dan Inovasi",
    slug: "unaic-perkuat-kerjasama-riset",
    date: "12 Oktober 2025",
    author: "Lembaga Riset UNAIC",
    category: "Berita", // Changed to Berita
    thumbnail: "/uploads/1768462158164_mou1.jpg",
    excerpt: "UNAIC memperluas kolaborasi penelitian dengan institusi nasional dan internasional untuk meningkatkan kualitas riset.",
    content: `<p>UNAIC memperluas kolaborasi penelitian dengan institusi nasional dan internasional...</p>`,
  },
  {
    id: "3",
    title: "Lowongan Dosen Tetap Prodi Farmasi",
    slug: "lowongan-dosen-farmasi-2025",
    date: "15 November 2025",
    author: "HRD UNAIC",
    category: "Karir",
    thumbnail: "/uploads/1768635508115_WhatsApp-Image-2025-12-31-at-10.56.43.jpeg", // Ensure this exists or use placeholder
    excerpt: "Dibuka kesempatan berkarir sebagai Dosen Tetap Program Studi Farmasi dengan kualifikasi S2/S3 Farmasi.",
    content: `<p>Universitas Al-Irsyad Cilacap membuka kesempatan bagi lulusan terbaik untuk bergabung sebagai Dosen Tetap...</p>`,
  },
  {
    id: "4",
    title: "Jadwal Registrasi Ulang Semester Genap 2025/2026",
    slug: "jadwal-registrasi-ulang-genap-2025",
    date: "01 Desember 2025",
    author: "BAAK UNAIC",
    category: "Pengumuman",
    thumbnail: "/uploads/1768635088498_news1.png",
    excerpt: "Pemberitahuan bagi seluruh mahasiswa aktif mengenai jadwal dan tata cara registrasi ulang semester genap.",
    content: `<p>Diberitahukan kepada seluruh mahasiswa bahwa registrasi ulang akan dilaksanakan mulai tanggal...</p>`,
  },
];

// Helper to format/parse dates if needed (Assuming ISO or consistent string)
// Here we just map Agenda to NewsItem

const agendaNews: NewsItem[] = agenda.map((item, index) => ({
  id: `agenda-${index}`,
  title: item.title,
  slug: item.slug,
  date: item.date, // format(new Date(item.date), "dd MMMM yyyy", { locale: id }), // Optional formatting if source is ISO
  author: item.organizer,
  category: "Agenda" as NewsCategory,
  thumbnail: item.image,
  excerpt: `Agenda: ${item.date} di ${item.location}. ${item.title}`,
  content: item.description,
  eventDate: item.date,
  location: item.location,
}));

// Unified Repository
export const allNewsData: NewsItem[] = [...rawNews, ...agendaNews].sort((a, b) => {
  // Simple string comparison for dates or better parsing
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});

// --- Repository Functions (Simulating CMS SDK) ---

export const getAllNews = (category?: NewsCategory | 'All'): NewsItem[] => {
  if (!category || category === 'All') {
    return allNewsData;
  }
  return allNewsData.filter((item) => item.category === category);
};

export const getNewsBySlug = (slug: string): NewsItem | undefined => {
  return allNewsData.find((item) => item.slug === slug);
};

export const getFeaturedNews = (): NewsItem[] => {
  return allNewsData.filter((item) => item.isFeatured);
};

// Backwards compatibility export if needed
export const berita = allNewsData; 
