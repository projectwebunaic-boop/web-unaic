"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import SectionTitle from "@/components/shared/SectionTitle";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { useLocale } from "next-intl";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// ... imports

// Removed hardcoded testimonials

export default function Testimonials({ data, items }: { data: any, items: any[] }) {
  const swiperRef = useRef<SwiperType>(null);
  const locale = useLocale();
  const isEn = locale === 'en';

  // Filter only items with testimonials if needed, or just map 'items' which are featured alumni
  const testimonials = items || [];

  if (!data || testimonials.length === 0) return null;

  return (
    <section className="bg-gray-50 py-24 sm:py-32 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionTitle
          title={isEn ? (data.titleEn || data.title || "Alumni & Student Stories") : (data.title || "Cerita Alumni & Mahasiswa")}
          subtitle={isEn ? (data.subtitleEn || data.subtitle || "Testimonials") : (data.subtitle || "Testimoni")}
          description={isEn ? (data.descriptionEn || data.description || "Hear directly the experiences of those who have pursued education and achieved success with Universitas Al-Irsyad Cilacap.") : (data.description || "Dengarkan langsung pengalaman mereka yang telah menempuh pendidikan dan meraih kesuksesan bersama Universitas Al-Irsyad Cilacap.")}
        />

        <div className="relative mt-16 max-w-5xl mx-auto">
          {/* Decorative Background Elements */}
          <div className="absolute -top-10 -left-10 text-unaicGold/10">
            <Quote size={120} />
          </div>
          <div className="absolute -bottom-10 -right-10 text-unaicNavy/5 rotate-180">
            <Quote size={120} />
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={40}
            slidesPerView={1}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet-custom',
              bulletActiveClass: 'swiper-pagination-bullet-active-custom',
            }}
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="pb-12"
          >
            {testimonials.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 mx-4 my-2">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    {/* Image Circle */}
                    <motion.div
                      className="relative shrink-0"
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-br from-unaicGold to-unaicNavy">
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-white relative">
                          <Image
                            src={item.image || "/images/placeholder.jpg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-unaicNavy text-white p-2 rounded-full shadow-lg">
                        <Quote size={16} />
                      </div>
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex gap-1 justify-center md:justify-start mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={18} className="fill-unaicGold text-unaicGold" />
                        ))}
                      </div>
                      <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed font-light italic mb-6">
                        "{isEn ? (item.testimonialEn || item.testimonial) : item.testimonial}"
                      </blockquote>
                      <div>
                        <h4 className="font-heading font-bold text-unaicNavy text-xl">{item.name}</h4>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                          {isEn ? (item.positionEn || item.position || item.graduationEn || item.graduation) : (item.position || item.graduation)}
                          {item.company ? ` at ${item.company}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="p-3 rounded-full bg-white text-unaicNavy shadow-md hover:bg-unaicNavy hover:text-white transition-all duration-300 group"
            >
              <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="p-3 rounded-full bg-white text-unaicNavy shadow-md hover:bg-unaicNavy hover:text-white transition-all duration-300 group"
            >
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/alumni-karir"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-unaicNavy border border-gray-200 rounded-full shadow-lg hover:bg-unaicNavy hover:text-white hover:border-unaicNavy transition-all duration-300 font-medium transform hover:-translate-y-1"
            >
              {isEn ? "See More Stories" : "Lihat Selengkapnya"}
            </Link>
          </div>
        </div>

        <style jsx global>{`
          .swiper-pagination-bullet-custom {
            width: 10px;
            height: 10px;
            background-color: #CBD5E1;
            display: inline-block;
            border-radius: 50%;
            margin: 0 5px;
            cursor: pointer;
            transition: all 0.3s;
          }
          .swiper-pagination-bullet-active-custom {
            background-color: #0A2647;
            width: 24px;
            border-radius: 10px;
          }
        `}</style>
      </div>
    </section>
  );
}
