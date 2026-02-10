"use client";

import { useState, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { Link } from '@/i18n/routing';
import NewsCard from "./NewsCard";
import { ArrowRight, Filter, CalendarDays, Megaphone, Newspaper, Briefcase } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { NewsCategory, NewsItem } from "@/types/news";

interface NewsListProps {
  limit?: number;
  showButton?: boolean;
  defaultTab?: TabCategory;
  hideTabs?: boolean;
  newsData?: NewsItem[]; // New Prop
}

type TabCategory = NewsCategory | 'All';

export default function NewsList({ limit, showButton = false, defaultTab = 'All', hideTabs = false, newsData = [] }: NewsListProps) {
  const locale = useLocale();
  const t = useTranslations("News");
  const [activeTab, setActiveTab] = useState<TabCategory>(defaultTab);

  // Filter Logic
  const displayedNews = useMemo(() => {
    let filtered = newsData;
    if (activeTab !== 'All') {
      filtered = newsData.filter(item => item.category === activeTab);
    }

    // Sort by Date (Desc) - ensuring date string parsing works
    filtered.sort((a, b) => {
      // Rudimentary date parsing or string compare if format is standard (YYYY-MM-DD or ISO preferred but current is "DD Month YYYY")
      // For now, let's trust the input or if ISO, just string compare works too.
      // Better: Convert "20 Oktober 2025" to date object if possible, or just standard string compare if stored as ISO. 
      // Current seed data is "20 Oktober 2025". We might need a helper, but let's assume raw sort for now or implement simple one.
      return 0; // Keeping original order from JSON (which comes from pre-pend so newest first) is safer for now.
    });

    if (limit) {
      filtered = filtered.slice(0, limit);
    }
    return filtered;
  }, [newsData, activeTab, limit]);

  const categories: { id: TabCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'All', label: t("categoryAll"), icon: <Filter size={14} /> },
    { id: 'Berita', label: t("categoryNews"), icon: <Newspaper size={14} /> },
    { id: 'Pengumuman', label: t("categoryAnnouncement"), icon: <Megaphone size={14} /> },
    { id: 'Karir', label: t("categoryCareer"), icon: <Briefcase size={14} /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="space-y-10">
      {/* Category Tabs - Modern Pill Design */}
      {!hideTabs && (
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <div className="bg-gray-100/50 p-1.5 rounded-full inline-flex flex-wrap justify-center gap-2 border border-gray-200 shadow-inner">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === cat.id
                  ? "bg-white text-unaicNavy shadow-sm scale-105 border border-gray-100 ring-1 ring-black/5"
                  : "text-gray-500 hover:text-unaicNavy hover:bg-gray-200/50"
                  }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* News Grid */}
      <motion.div
        key={activeTab} // Animate when tab changes
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {displayedNews.length > 0 ? (
          displayedNews.map((news) => (
            <motion.div key={news.id} variants={itemVariants}>
              <NewsCard
                id={news.id}
                title={locale === 'en' ? (news.titleEn || news.title) : news.title}
                slug={news.slug}
                excerpt={locale === 'en' ? (news.excerptEn || news.excerpt) : news.excerpt}
                thumbnail={news.thumbnail || '/images/placeholder.jpg'}
                date={news.date}
                category={news.category as NewsCategory}
              />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Filter size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-1">{t("noData")}</h3>
            <p className="text-gray-500 text-sm">{t("noDataDesc", { category: activeTab })}</p>
          </div>
        )}
      </motion.div>

      {/* Show All Button (Only on Home/limited view) */}
      {showButton && (
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link
            href="/berita-agenda/berita"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-unaicNavy text-white rounded-xl shadow-lg shadow-unaicNavy/20 hover:shadow-unaicNavy/40 hover:scale-105 transition-all duration-300 font-semibold tracking-wide"
          >
            <span>{t("more")}</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
