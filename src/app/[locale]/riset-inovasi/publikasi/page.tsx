"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";
import { FileText, Download, Filter, ExternalLink, BookOpen, Users, Loader2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";

interface Journal {
  id: string;
  name: string; // mapped from title
  title: string;
  titleEn?: string;
  link: string;
  description?: string;
  descriptionEn?: string;
}

interface PublicationItem {
  id: string;
  title: string;
  titleEn?: string;
  authors: string;
  year: string;
  category: "Prosiding" | "Artikel";
  pdfUrl: string;
}

interface PublicationsData {
  journals: Journal[];
  proceedings: PublicationItem[];
  articles: PublicationItem[];
}

export default function PublikasiPage() {
  const t = useTranslations("Publication");
  const locale = useLocale();
  const isEn = locale === 'en';

  const [activeTab, setActiveTab] = useState<"Jurnal" | "Prosiding" | "Artikel">("Jurnal");
  const [data, setData] = useState<PublicationsData>({ journals: [], proceedings: [], articles: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/publications');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch publications", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Helper for localized text
  const tx = (id?: string | null, en?: string | null) => (isEn && en) ? en : (id || "");

  return (
    <main className="bg-white font-sans text-gray-700">
      <HeroSection
        title={t('title')}
        subtitle={t('subtitle')}
        backgroundImage="/images/background/library-bg.jpg"
      />

      <section className="container mx-auto px-4 py-16">
        <SectionTitle>{t('repoTitle')}</SectionTitle>

        {/* Tab Navigation */}
        <div className="flex justify-center mt-8 mb-12">
          <div className="bg-gray-100 p-1 rounded-xl flex flex-wrap justify-center gap-2">
            {[
              { key: "Jurnal", label: t('tabs.journal') },
              { key: "Prosiding", label: t('tabs.proceeding') },
              { key: "Artikel", label: t('tabs.article') }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${activeTab === tab.key
                  ? "bg-[#0A2E5C] text-white shadow-md"
                  : "text-gray-600 hover:text-[#0A2E5C] hover:bg-white/50"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p>{t('loading') || "Memuat data..."}</p>
          </div>
        ) : (
          <div className="min-h-[400px]">
            {/* JURNAL VIEW - MODERN CARDS (HIGH FIDELITY) */}
            {activeTab === "Jurnal" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.journals.map((journal, index) => (
                  <div
                    key={journal.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-gray-100 transform hover:-translate-y-2"
                  >
                    {/* Card Header - Dark Blue */}
                    <div className="bg-[#0A2E5C] p-6 relative overflow-hidden">
                      {/* Abstract Shape Overlay */}
                      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>

                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <span className="inline-block bg-[#FFD700] text-[#0A2E5C] text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                          {t('tabs.journal')}
                        </span>
                        <div className="p-1 px-2 bg-white/10 rounded-lg backdrop-blur-sm">
                          <BookOpen className="w-4 h-4 text-white/90" />
                        </div>
                      </div>
                      <h3 className="text-white font-heading font-bold text-lg leading-snug line-clamp-3 min-h-[56px] relative z-10 group-hover:text-yellow-400 transition-colors">
                        {tx(journal.title, journal.titleEn) || journal.name}
                      </h3>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="mb-6">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                          {t('desc')}
                        </p>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {tx(journal.description, journal.descriptionEn) || (isEn ? "Official scientific journal of Universitas Al-Irsyad Cilacap publishing current research results." : "Jurnal ilmiah resmi Universitas Al-Irsyad Cilacap yang mempublikasikan hasil penelitian terkini.")}
                        </p>
                      </div>

                      {/* Footer Action */}
                      <div className="mt-auto pt-6 border-t border-gray-50">
                        <a
                          href={journal.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full gap-2 px-4 py-3 bg-gray-50 text-[#0A2E5C] font-bold text-sm rounded-xl hover:bg-[#0A2E5C] hover:text-white transition-all duration-300 group-hover:shadow-md"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {t('visitJournal')}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
                {data.journals.length === 0 && (
                  <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">{t('noData')}</p>
                  </div>
                )}
              </div>
            )}

            {/* PROSIDING & ARTIKEL VIEW - MODERN CARDS */}
            {(activeTab === "Prosiding" || activeTab === "Artikel") && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(activeTab === "Prosiding" ? data.proceedings : data.articles).map((item, index) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-gray-100 transform hover:-translate-y-2"
                  >
                    {/* Card Header */}
                    <div className="bg-[#0A2E5C] p-6 relative overflow-hidden">
                      {/* Abstract Shape Overlay */}
                      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>

                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <span className="inline-block bg-[#FFD700] text-[#0A2E5C] text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                          {activeTab === "Prosiding" ? t('tabs.proceeding') : t('tabs.article')}
                        </span>
                        <span className="text-white/90 text-sm font-medium tracking-wide font-mono">
                          {item.year}
                        </span>
                      </div>
                      <h3 className="text-white font-heading font-bold text-lg leading-snug line-clamp-3 min-h-[56px] relative z-10 group-hover:text-yellow-400 transition-colors">
                        {tx(item.title, item.titleEn)}
                      </h3>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-start gap-3 mb-6">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                            {t('author')}
                          </p>
                          <p className="text-gray-700 font-medium text-sm leading-relaxed">
                            {item.authors}
                          </p>
                        </div>
                      </div>

                      {/* Footer Action */}
                      <div className="mt-auto pt-6 border-t border-gray-50">
                        <a
                          href={item.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full gap-2 px-4 py-3 bg-gray-50 text-[#0A2E5C] font-bold text-sm rounded-xl hover:bg-[#0A2E5C] hover:text-white transition-all duration-300 group-hover:shadow-md"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {t('visitArticle')}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
                {(activeTab === "Prosiding" ? data.proceedings : data.articles).length === 0 && (
                  <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">{t('noData')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
