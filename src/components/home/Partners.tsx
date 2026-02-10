"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from '@/i18n/routing';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionTitle from "@/components/shared/SectionTitle";
import { useLocale } from "next-intl";

import "swiper/css";
import "swiper/css/navigation";

// ... imports

// Removed hardcoded partners if any

export default function Partners({ data, items }: { data: any, items: any[] }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const partners = items || [];

  if (!data) return null;

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionTitle
          title={isEn ? (data.titleEn || data.title || "Partners & Collaboration") : (data.title || "Mitra & Kerjasama")}
          subtitle={isEn ? (data.subtitleEn || data.subtitle || "Global Network") : (data.subtitle || "Jaringan Global")}
          description={isEn ? (data.descriptionEn || data.description || "UNAIC establishes strategic partnerships with various institutions, industries, and universities both domestically and abroad to improve the quality of education.") : (data.description || "UNAIC menjalin kemitraan strategis dengan berbagai institusi, industri, dan universitas dalam maupun luar negeri untuk meningkatkan kualitas pendidikan.")}
          align="center"
        />

        <motion.div
          className="relative px-8 md:px-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                duration: 0.5,
                delay: 0.3,
                staggerChildren: 0.2,
              },
            },
          }}
        >
          <Swiper
            modules={[Autoplay, Navigation]}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              nextEl: ".swiper-button-next-partner",
              prevEl: ".swiper-button-prev-partner",
            }}
            slidesPerView={2}
            spaceBetween={20}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 30 },
              768: { slidesPerView: 4, spaceBetween: 40 },
              1024: { slidesPerView: 5, spaceBetween: 40 },
            }}
            className="py-8"
          >
            {partners.map((partner) => (
              <SwiperSlide key={partner.id} className="h-auto">
                <motion.div
                  className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-lg h-full group grayscale hover:grayscale-0"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
                >
                  <div className="h-16 w-full relative flex items-center justify-center">
                    <Image
                      src={partner.logo || (partner.images && partner.images[0]) || "/images/placeholder.jpg"}
                      alt={partner.name}
                      width={120}
                      height={60}
                      className="max-h-16 w-auto object-contain opacity-70 group-hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation */}
          <button className="swiper-button-prev-partner absolute top-1/2 -translate-y-1/2 left-0 z-10 p-3 bg-white hover:bg-gray-50 text-unaicNavy rounded-full shadow-md border border-gray-100 transition">
            <ChevronLeft size={20} />
          </button>
          <button className="swiper-button-next-partner absolute top-1/2 -translate-y-1/2 right-0 z-10 p-3 bg-white hover:bg-gray-50 text-unaicNavy rounded-full shadow-md border border-gray-100 transition">
            <ChevronRight size={20} />
          </button>
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}
        >
          <Link
            href="/tentang/mitra"
            className="inline-block border-2 border-unaicNavy text-unaicNavy px-8 py-3 rounded-full font-semibold hover:bg-unaicNavy hover:text-white transition-all duration-300"
          >
            {isEn ? "View All Partners" : "Lihat Semua Mitra"}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
