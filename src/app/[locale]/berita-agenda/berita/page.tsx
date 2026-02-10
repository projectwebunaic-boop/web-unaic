
import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";
import NewsList from "@/components/news/NewsList";
import fs from 'fs';
import path from 'path';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

async function getNewsData() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/news.json');
    if (!fs.existsSync(filePath)) return [];
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading news data:", error);
    return [];
  }
}

export default async function BeritaAgendaBeritaPage() {
  const newsData = await getNewsData();
  const t = await getTranslations("News");

  return (
    <main className="bg-white font-sans text-gray-700">
      {/* Hero Section */}
      <HeroSection
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
      />

      {/* Berita Terkini Section */}
      <section className="container mx-auto px-4 py-12">
        <SectionTitle>{t("latestNews")}</SectionTitle>

        <NewsList newsData={newsData} />
      </section>
    </main>
  );
}
