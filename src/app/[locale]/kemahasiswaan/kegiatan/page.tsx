"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Calendar, Users, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";
import { useLocale } from "next-intl";

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};



export default function KegiatanMahasiswaPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activities, setActivities] = useState([]);
  const locale = useLocale();
  const isEn = locale === 'en';

  useEffect(() => {
    fetch(`/api/admin/activities?t=${Date.now()}`, { cache: "no-store", headers: { 'Pragma': 'no-cache' } })
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(err => console.error("Failed to load activities", err));
  }, []);

  // Helper for localized text
  const tx = (id?: string | null, en?: string | null) => (isEn && en) ? en : (id || "");

  // Derive gallery images from activities
  // Filter out activities without images or with default placeholders if desired
  const galleryImages = activities.length > 0
    ? activities.map((item: any) => ({ src: item.image, caption: tx(item.title, item.titleEn) }))
    : [
      { src: "/images/kegiatan/galeri-1.jpg", caption: "Galeri Kegiatan 1" },
      { src: "/images/kegiatan/galeri-2.jpg", caption: "Galeri Kegiatan 2" }
    ]; // Fallback if no data yet

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  // Reset slide if it goes out of bounds when data changes
  useEffect(() => {
    if (currentSlide >= galleryImages.length) {
      setCurrentSlide(0);
    }
  }, [galleryImages.length]);

  return (
    <main className="bg-white font-sans text-gray-700">
      {/* Hero Section */}
      <HeroSection
        title={isEn ? "Student Activities" : "Kegiatan Mahasiswa"}
        subtitle={isEn ? "Various UNAIC student activities to develop academic, social, and leadership potential." : "Berbagai aktivitas mahasiswa UNAIC untuk mengembangkan potensi akademik, sosial, dan kepemimpinan."}
      />

      {/* Aktivitas Kemahasiswaan Section */}
      <section className="container mx-auto px-4 py-12">
        <SectionTitle>{isEn ? "Student Activities" : "Aktivitas Kemahasiswaan"}</SectionTitle>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(activities) && activities.length > 0 ? (
            activities.map((kegiatan: any) => (
              <div
                key={kegiatan.id}
                className="bg-white rounded-lg shadow hover:shadow-lg p-6 transition-all duration-300 hover:scale-105"
              >
                {/* Activity Image */}
                <div className="overflow-hidden rounded-lg mb-4 bg-gray-100 h-48 relative">
                  <Image
                    src={kegiatan.image}
                    alt={kegiatan.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>

                {/* Activity Title */}
                <h3 className="font-bold text-lg text-unaicNavy mb-3 leading-relaxed line-clamp-2 min-h-[3.5rem]">
                  {tx(kegiatan.title, kegiatan.titleEn)}
                </h3>

                {/* Activity Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 min-h-[4.5rem]">
                  {tx(kegiatan.description, kegiatan.descriptionEn)}
                </p>

                {/* Date & Location */}
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <Calendar className="w-4 h-4 mr-2 text-unaicBlue shrink-0" />
                  <span className="mr-4 truncate">{tx(kegiatan.date, kegiatan.dateEn)}</span>
                  <MapPin className="w-4 h-4 mr-2 text-unaicBlue shrink-0" />
                  <span className="truncate max-w-[100px]">{tx(kegiatan.location, kegiatan.locationEn)}</span>
                </div>

                {/* Detail Button */}
                <Link
                  href={`/kemahasiswaan/kegiatan/${kegiatan.slug}`}
                  className="block w-full text-center px-3 py-2 bg-unaicNavy text-white rounded hover:bg-unaicGold transition-colors duration-300 text-sm font-medium"
                >
                  {isEn ? "View Details" : "Lihat Detail"}
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-500">
              {activities === null ? (isEn ? "Failed to load data." : "Gagal memuat data.") : (isEn ? "No specific student activities yet." : "Belum ada kegiatan mahasiswa.")}
            </div>
          )}
        </div>
      </section>

      {/* Galeri Kegiatan Section */}
      <section className="container mx-auto px-4 py-12">
        <SectionTitle>{isEn ? "Activity Gallery" : "Galeri Kegiatan"}</SectionTitle>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInVariants}
          className="relative"
        >
          <div className="overflow-hidden rounded-xl shadow-lg">
            <div className="relative h-64 md:h-96">
              <Image
                src={galleryImages[currentSlide].src}
                alt={galleryImages[currentSlide].caption}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <p className="text-white text-lg font-medium">
                  {galleryImages[currentSlide].caption}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6 text-unaicNavy" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6 text-unaicNavy" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {galleryImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentSlide ? "bg-unaicNavy" : "bg-gray-300"
                  }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
