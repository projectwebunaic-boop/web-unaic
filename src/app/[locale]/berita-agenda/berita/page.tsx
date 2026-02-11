
import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";
import NewsList from "@/components/news/NewsList";
import prisma from "@/lib/prisma";
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

async function getNewsData() {
  try {
    const news = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    });
    // Map to expected format
    return news.map(n => ({
      id: n.id,
      title: n.title,
      titleEn: n.titleEn,
      slug: n.slug,
      content: n.content || "", // Added content
      // @ts-ignore
      excerpt: n.excerpt,
      // @ts-ignore
      thumbnail: n.image,
      // @ts-ignore
      author: n.author || "Admin", // Added author
      date: new Date(n.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      category: n.category
    }));
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
        subtitle={`${t("heroSubtitle")} (Total: ${newsData.length})`}
      />

      {/* Berita Terkini Section */}
      <section className="container mx-auto px-4 py-12">
        <SectionTitle>{t("latestNews")}</SectionTitle>

        <NewsList newsData={newsData} />
      </section>
    </main>
  );
}
