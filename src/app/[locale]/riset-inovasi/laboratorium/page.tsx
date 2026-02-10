"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { FlaskRound, Microscope, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";

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

const laboratoriumData = [
  {
    id: "keperawatan",
    name: "Laboratorium Keperawatan",
    description: "Praktikum keterampilan dasar keperawatan dan simulasi perawatan pasien",
    image: "/images/fasilitas/lab.jpg",
    icon: <FlaskRound className="w-8 h-8 text-unaicNavy" />
  },
  {
    id: "kebidanan",
    name: "Laboratorium Kebidanan",
    description: "Simulasi persalinan & perawatan ibu-anak dengan peralatan modern",
    image: "/images/fasilitas/lab.jpg",
    icon: <Microscope className="w-8 h-8 text-unaicNavy" />
  },
  {
    id: "farmasi",
    name: "Laboratorium Farmasi",
    description: "Formulasi & analisis obat dengan teknologi terkini",
    image: "/images/fasilitas/lab.jpg",
    icon: <FlaskRound className="w-8 h-8 text-unaicNavy" />
  },
  {
    id: "tlm",
    name: "Laboratorium TLM",
    description: "Analisis klinik & diagnostik untuk praktikum mahasiswa",
    image: "/images/fasilitas/lab.jpg",
    icon: <Microscope className="w-8 h-8 text-unaicNavy" />
  },
  {
    id: "informatika",
    name: "Laboratorium Informatika",
    description: "Komputer & jaringan untuk pengembangan software dan sistem",
    image: "/images/fasilitas/lab.jpg",
    icon: <FlaskRound className="w-8 h-8 text-unaicNavy" />
  },
  {
    id: "bisnis-digital",
    name: "Laboratorium Bisnis Digital",
    description: "Startup & simulasi bisnis dengan teknologi digital terkini",
    image: "/images/fasilitas/lab.jpg",
    icon: <Microscope className="w-8 h-8 text-unaicNavy" />
  }
];

const galleryImages = [
  { src: "/images/fasilitas/lab.jpg", caption: "Laboratorium Modern UNAIC" },
  { src: "/images/fasilitas/lab.jpg", caption: "Fasilitas Praktikum" },
  { src: "/images/fasilitas/lab.jpg", caption: "Ruang Riset Mahasiswa" },
  { src: "/images/fasilitas/lab.jpg", caption: "Peralatan Laboratorium" },
  { src: "/images/fasilitas/lab.jpg", caption: "Simulasi Praktikum" },
  { src: "/images/fasilitas/lab.jpg", caption: "Teknologi Terdepan" }
];

export default function LaboratoriumPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  return (
    <main className="bg-white font-sans text-gray-700">
      {/* Hero Section */}
      <HeroSection
        title="LABORATORIUM UNAIC"
        subtitle="Fasilitas laboratorium UNAIC yang mendukung kegiatan pendidikan, penelitian, dan inovasi."
      />

      {/* Fasilitas Laboratorium Section */}
      <section className="container mx-auto px-4 py-12">
        <SectionTitle>Fasilitas Laboratorium</SectionTitle>

        {/* Description Section */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUpVariants}
              >
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-unaicNavy mb-6">
                  Fasilitas Laboratorium Modern
                </h2>
                <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                  <p>
                    Universitas Al-Irsyad Cilacap (UNAIC) menyediakan berbagai laboratorium modern
                    untuk menunjang kegiatan penelitian, praktikum, dan inovasi.
                  </p>
                  <p>
                    Setiap laboratorium dilengkapi dengan peralatan mutakhir yang dapat digunakan
                    mahasiswa dan dosen sesuai bidang keilmuan.
                  </p>
                  <p>
                    Laboratorium tidak hanya berfungsi sebagai tempat praktikum, tetapi juga
                    sebagai pusat riset dan pengembangan teknologi.
                  </p>
                </div>
              </motion.div>

              {/* Right Column - Icon */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUpVariants}
                className="flex justify-center lg:justify-end"
              >
                <div className="bg-unaicBlue p-8 rounded-2xl shadow-lg">
                  <FlaskRound className="w-24 h-24 text-white" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Laboratory Grid Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUpVariants}
              className="text-center mb-12"
            >
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-unaicNavy mb-4">
                Fasilitas Laboratorium
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Laboratorium modern yang mendukung pembelajaran dan riset di berbagai bidang keilmuan
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {laboratoriumData.map((lab, index) => (
                <motion.div
                  key={lab.id}
                  variants={staggerItemVariants}
                  className="bg-white rounded-xl shadow-md border border-unaicNavy/10 overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group"
                >
                  <div className="overflow-hidden">
                    <Image
                      src={lab.image}
                      alt={lab.name}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      {lab.icon}
                      <h3 className="ml-3 font-heading text-xl font-semibold text-unaicNavy">
                        {lab.name}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {lab.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto max-w-6xl px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUpVariants}
              className="text-center mb-12"
            >
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-unaicNavy mb-4">
                Galeri Laboratorium
              </h2>
              <p className="text-gray-600 text-lg">
                Melihat lebih dekat fasilitas laboratorium UNAIC
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
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
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-unaicNavy to-unaicBlue py-16 sm:py-24">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUpVariants}
            >
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-6">
                Akses & Pemanfaatan Laboratorium
              </h2>
              <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
                Hubungi pengelola laboratorium untuk peminjaman dan jadwal praktikum.
                Fasilitas laboratorium terbuka untuk mahasiswa, dosen, dan peneliti.
              </p>
              <Link
                href="/kontak"
                className="inline-block bg-unaicGold hover:bg-yellow-400 text-unaicNavy font-semibold px-8 py-4 rounded-lg shadow-lg transition-colors duration-300 text-lg"
              >
                Kontak Laboratorium
              </Link>
            </motion.div>
          </div>
        </section>
      </section>
    </main>
  );
}
