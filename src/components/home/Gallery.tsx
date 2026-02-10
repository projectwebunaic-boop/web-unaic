"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import SectionTitle from "@/components/shared/SectionTitle";
import { useLocale } from "next-intl";
import { galleryItems } from "@/data/gallery";

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

export default function Gallery({ data }: { data: any }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const locale = useLocale();
  const isEn = locale === 'en';

  // Use centralized gallery data
  const images = galleryItems.slice(0, 8); // Show first 8 items for the slide

  const nextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1);
    }
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  if (!data) return null;

  return (
    <>
      <section className="bg-white py-20 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionTitle
            title={isEn ? (data.titleEn || data.title || "Activity Documentation") : (data.title || "Dokumentasi Kegiatan")}
            subtitle={isEn ? (data.subtitleEn || data.subtitle || "UNAIC Gallery") : (data.subtitle || "Galeri UNAIC")}
            description={isEn ? (data.descriptionEn || data.description || "Recording the trace of academic and student activities in the Universitas Al-Irsyad Cilacap environment.") : (data.description || "Merekam jejak aktivitas akademik dan kemahasiswaan di lingkungan Universitas Al-Irsyad Cilacap.")}
            align="center"
          />

          <motion.div
            className="mt-12 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
                1280: {
                  slidesPerView: 4,
                },
              }}
              className="pb-12 px-4"
            >
              {images.map((item, index) => (
                <SwiperSlide key={item.id} className="h-full">
                  <div
                    className="relative group overflow-hidden rounded-2xl shadow-md cursor-pointer aspect-[4/3] bg-gray-100"
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={item.src}
                      alt={isEn ? (item.titleEn || item.title) : item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-unaicNavy/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="bg-unaicGold text-unaicNavy text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block">
                          {item.category}
                        </span>
                        <p className="text-white font-semibold text-sm line-clamp-2">
                          {isEn ? (item.titleEn || item.title) : item.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <div className="hidden md:flex justify-center gap-4 mt-6">
              <button className="swiper-button-prev-custom w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-unaicNavy hover:bg-unaicNavy hover:text-white transition-colors cursor-pointer">
                <ChevronLeft size={20} />
              </button>
              <button className="swiper-button-next-custom w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-unaicNavy hover:bg-unaicNavy hover:text-white transition-colors cursor-pointer">
                <ChevronRight size={20} />
              </button>
            </div>

          </motion.div>

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/galeri"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-unaicNavy border border-gray-200 rounded-full shadow-lg hover:bg-unaicNavy hover:text-white hover:border-unaicNavy transition-all duration-300 font-medium transform hover:-translate-y-1"
            >
              {isEn ? "See Full Gallery" : "Lihat Galeri Lengkap"}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Modal Lightbox */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            onClick={closeModal}
            tabIndex={-1}
          >
            <div className="relative max-w-6xl w-full h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <div className="relative w-full h-full max-h-[80vh]">
                <Image
                  src={images[selectedImageIndex].src}
                  alt={isEn ? (images[selectedImageIndex].titleEn || images[selectedImageIndex].title) : images[selectedImageIndex].title}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Navigation Controls */}
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-4 transition backdrop-blur-md border border-white/20"
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-4 transition backdrop-blur-md border border-white/20"
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <button
                className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition backdrop-blur-md border border-white/20"
                onClick={(e) => { e.stopPropagation(); closeModal(); }}
              >
                <Search className="w-6 h-6 rotate-45" /> {/* Use Search rotated as generic close or substitute with X icon if available */}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
