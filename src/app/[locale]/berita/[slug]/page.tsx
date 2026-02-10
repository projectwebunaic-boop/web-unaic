import fs from 'fs';
import path from 'path';
import HeroSection from "@/components/shared/HeroSection";
import { Link } from '@/i18n/routing';
import ShareButton from "@/components/shared/ShareButton";
import { notFound } from 'next/navigation';
import { getTranslations, getLocale } from 'next-intl/server';

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

export default async function ArtikelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("News");
  const newsData = await getNewsData();
  const article = newsData.find((b: any) => b.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-white text-gray-800">
        <HeroSection title={t("defaultTitle")} subtitle={t("notFound")} />
        <div className="max-w-4xl mx-auto py-20 px-4 text-center">
          <p className="text-gray-500 text-lg mb-8">{t("notFoundDesc")}</p>
          <Link
            href="/berita-agenda/berita"
            className="bg-[#0A1F44] text-white px-6 py-3 rounded-lg hover:bg-[#FFD700] hover:text-[#0A1F44] transition-all inline-block"
          >
            ← {t("backToList")}
          </Link>
        </div>
      </div>
    );
  }

  // Get related articles (excluding current article)
  const relatedArticles = newsData
    .filter((b: any) => b.slug !== slug && b.category === article.category)
    .slice(0, 3);

  const displayTitle = locale === 'en' ? (article.titleEn || article.title) : article.title;
  const displayContent = locale === 'en' ? (article.contentEn || article.content) : article.content;

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <HeroSection title={t("defaultTitle")} subtitle={displayTitle} />

      <div className="max-w-4xl mx-auto py-10 px-4">
        {article.thumbnail && (
          <img
            src={article.thumbnail}
            alt={article.title}
            className="rounded-xl mb-6 shadow-lg w-full object-cover h-64 md:h-96"
          />
        )}

        <div className="text-sm text-gray-500 mb-3">
          {article.date} · {article.category} · {t("by")} {article.author}
        </div>

        <h1 className="text-3xl font-bold mb-6 text-[#0A1F44]">{displayTitle}</h1>

        <div
          className="prose prose-lg max-w-none text-justify animate-fadeIn"
          dangerouslySetInnerHTML={{ __html: displayContent }}
        />

        {/* Action Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link
            href="/berita-agenda/berita"
            className="flex items-center gap-2 text-gray-500 hover:text-[#0A1F44] font-medium transition-colors"
          >
            ← {t("backToList")}
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-gray-500 font-medium">{t("share")}:</span>
            <ShareButton
              title={article.title}
              text={`Baca berita ini: ${article.title}`}
            />
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-bold mb-6 text-[#0A1F44]">{t("relatedNews")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related: any) => (
                <div key={related.slug} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  {related.thumbnail && (
                    <img
                      src={related.thumbnail}
                      alt={related.title}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <div className="text-xs text-gray-500 mb-2">
                      {related.date} · {related.category}
                    </div>
                    <h4 className="font-semibold text-[#0A1F44] mb-2 line-clamp-2">
                      {locale === 'en' ? (related.titleEn || related.title) : related.title}
                    </h4>
                    <Link
                      href={`/berita/${related.slug}`}
                      className="text-[#FFD700] hover:text-[#0A1F44] text-sm font-medium"
                    >
                      {t("readMore")} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
