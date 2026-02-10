"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "@/components/shared/HeroSection";
import { galleryItems, galleryCategories } from "@/data/gallery";
import { X, Search, ZoomIn, Calendar } from "lucide-react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

export default function GaleriPage() {
  const t = useTranslations('Gallery');
  const locale = useLocale();
  const isEn = locale === 'en';
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  // Helper to translate category display name
  const getCategoryLabel = (category: string) => {
    if (category === "Semua") return t('filters.all');
    if (category === "Akademik") return t('categories.Academic');
    if (category === "Kemahasiswaan") return t('categories.Student');
    if (category === "Fasilitas") return t('categories.Facilities');
    if (category === "Event") return t('categories.Event');
    return category;
  };

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (activeCategory === "Semua") return galleryItems;
    return galleryItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const selectedItem = galleryItems.find((item) => item.id === selectedImageId);

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <HeroSection
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
      />

      {/* Filter Tabs */}
      <section className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 shadow-sm">
        <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex justify-start sm:justify-center gap-2 min-w-max px-2">
            {galleryCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
                  ? "text-white"
                  : "text-gray-500 hover:text-unaicNavy bg-gray-100/50 hover:bg-gray-100"
                  }`}
              >
                {activeCategory === category && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-unaicNavy rounded-full shadow-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{getCategoryLabel(category)}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid (Masonry using CSS columns) */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="break-inside-avoid"
              >
                <div
                  className="group relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer"
                  onClick={() => setSelectedImageId(item.id)}
                >
                  <div className="relative w-full">
                    <Image
                      src={item.src}
                      alt={isEn ? (item.titleEn || item.title) : item.title}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="inline-block px-3 py-1 mb-2 text-xs font-bold text-unaicNavy bg-unaicGold rounded-full">
                          {getCategoryLabel(item.category)}
                        </span>
                        <h3 className="text-white font-bold text-lg leading-tight mb-1">
                          {isEn ? (item.titleEn || item.title) : item.title}
                        </h3>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {isEn ? (item.descriptionEn || item.description) : item.description}
                        </p>
                      </div>
                    </div>

                    {/* Zoom Icon */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white">
                        <ZoomIn size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">{t('emptyTitle')}</h3>
            <p className="text-gray-500">{t('emptyDesc')}</p>
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImageId && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 sm:p-8"
            onClick={() => setSelectedImageId(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              onClick={() => setSelectedImageId(null)}
            >
              <X size={32} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-7xl w-full max-h-screen flex flex-col md:flex-row gap-6 bg-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Container */}
              <div className="flex-1 relative aspect-video md:aspect-auto flex items-center justify-center">
                <div className="relative w-full h-[60vh] md:h-[85vh]">
                  <Image
                    src={selectedItem.src}
                    alt={isEn ? (selectedItem.titleEn || selectedItem.title) : selectedItem.title}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Info Sidebar (Desktop) / Bottom Sheet (Mobile) */}
              <div className="w-full md:w-96 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-white md:h-auto md:self-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 text-xs font-bold text-unaicNavy bg-unaicGold rounded-full">
                    {getCategoryLabel(selectedItem.category)}
                  </span>
                  <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                    <Calendar size={14} />
                    <span>{selectedItem.date}</span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-3 leading-tight">
                  {isEn ? (selectedItem.titleEn || selectedItem.title) : selectedItem.title}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {isEn ? (selectedItem.descriptionEn || selectedItem.description) : selectedItem.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
