"use client";

import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface HeroProps {
  data?: {
    welcomePrefix?: string;
    welcomePrefixEn?: string;
    title?: string;
    titleEn?: string;
    subtitle?: string;
    subtitleEn?: string;
    videoUrl?: string;
  }
}

export default function Hero({ data }: HeroProps) {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const isEn = locale === 'en';

  const handleDaftarClick = () => {
    window.open('https://pmb.universitasalirsyad.ac.id/', '_blank');
  };

  // Use CMS data if available, otherwise fallback to translations/defaults
  const prefix = isEn ? (data?.welcomePrefixEn || data?.welcomePrefix || t("welcomePrefix")) : (data?.welcomePrefix || t("welcomePrefix"));
  const title = isEn ? (data?.titleEn || data?.title || t("heroTitle")) : (data?.title || t("heroTitle"));
  const subtitle = isEn ? (data?.subtitleEn || data?.subtitle || t("heroSubtitle")) : (data?.subtitle || t("heroSubtitle"));
  const videoUrl = data?.videoUrl || "/video/hero/herolooping.mp4";

  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden bg-unaicNavy m-0 p-0">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video
          className="w-full h-full object-cover scale-105 min-w-full min-h-full"
          autoPlay
          loop
          muted
          playsInline
          poster="/images/hero-poster.jpg"
          preload="auto"
          key={videoUrl} // Force reload if URL changes
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-unaicNavy/95 via-unaicNavy/70 to-unaicNavy/30 sm:to-transparent"></div>
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Content */}
      {/* CHANGED: justify-center -> justify-start, pt-36 sm:pt-48 to manually position content higher */}
      <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 h-full flex flex-col justify-start pt-32 sm:pt-44 md:pt-52 lg:pt-60 pb-24 md:pb-32">
        <motion.div
          className="max-w-4xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-blue-100 text-sm font-medium mb-3"
          >
            <span className="w-2 h-2 rounded-full bg-unaicGold animate-pulse"></span>
            {t("welcomeBadge")}
          </motion.div>

          {/* Title - Reduced sizes slightly for better fit on laptops */}
          <h1 className="font-heading font-bold text-white leading-tight mb-3">
            <span className="block text-2xl sm:text-4xl md:text-5xl mb-2">{prefix}</span>
            <span className="block text-3xl sm:text-5xl md:text-6xl text-unaicGold drop-shadow-lg">
              {title}
            </span>
          </h1>

          {/* Animated Text - Reduced height container */}
          <div className="h-14 sm:h-20 mb-4">
            <TypeAnimation
              sequence={[
                t("typeAnimation.text1"),
                2000,
                t("typeAnimation.text2"),
                2000,
                t("typeAnimation.text3"),
                2000,
              ]}
              wrapper="p"
              speed={50}
              className="text-lg sm:text-xl md:text-2xl text-gray-200 font-light max-w-2xl leading-relaxed"
              repeat={Infinity}
            />
          </div>

          <p className="text-white text-lg sm:text-xl max-w-2xl mb-6 leading-relaxed">
            {subtitle}
          </p>

          {/* Buttons - Ensuring they have top margin but not too much */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <button
              onClick={handleDaftarClick}
              className="group relative w-full sm:w-auto px-8 py-3 sm:py-4 bg-unaicGold text-unaicNavy font-bold rounded-xl shadow-lg hover:shadow-unaicGold/30 transition-all duration-300 hover:scale-105 overflow-hidden flex justify-center"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t("ctaRegister")}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>

            <Link
              href="/jelajah-kampus"
              className="w-full sm:w-auto px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              {t("ctaExplore")}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Hidden on smaller screens to save space */}
      <motion.div
        className="hidden md:flex absolute bottom-28 left-1/2 transform -translate-x-1/2 text-white/50 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
      >
        <span className="text-sm uppercase tracking-widest text-[10px]">Scroll Down</span>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce"></div>
        </div>
      </motion.div>
    </section>
  );
}
