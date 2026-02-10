"use client";

import NewsList from "@/components/news/NewsList";
import SectionTitle from "@/components/shared/SectionTitle";
import { useLocale } from "next-intl";

// ... imports

export default function News({ data, newsItems }: { data: any, newsItems: any[] }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  if (!data) return null;

  return (
    <section className="bg-gray-50 py-24 sm:py-32 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionTitle
          title={isEn ? (data.titleEn || data.title || "Campus News & Agenda") : (data.title || "Berita & Agenda Kampus")}
          subtitle={isEn ? (data.subtitleEn || data.subtitle || "Latest Updates") : (data.subtitle || "Update Terbaru")}
          description={isEn ? (data.descriptionEn || data.description || "Follow the latest developments, student achievements, and academic activity agenda at Universitas Al-Irsyad Cilacap.") : (data.description || "Ikuti perkembangan terbaru, prestasi mahasiswa, dan agenda kegiatan akademik di Universitas Al-Irsyad Cilacap.")}
          align="center"
        />

        {/* Content */}
        <div className="relative z-10">
          <NewsList limit={3} showButton={true} newsData={newsItems} />
        </div>
      </div>
    </section>
  );
}
