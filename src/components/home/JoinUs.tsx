"use client";

import { Link } from '@/i18n/routing';
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { useLocale } from "next-intl";

export default function JoinUs({ data }: { data?: any }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  return (
    <section className="relative bg-unaicNavy text-white py-24 md:py-32 text-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-unaicNavy via-blue-900 to-unaicNavy z-0"></div>
      <div className="absolute inset-0 opacity-20 bg-[url('/patterns/wave.svg')] bg-cover bg-fixed z-0"></div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[50%] -left-[20%] w-[100%] h-[100%] rounded-full border border-white/5 z-0"
      ></motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 container mx-auto px-6 md:px-12"
      >
        <h2 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-2xl font-heading tracking-tight">
          {isEn ? (data?.titleEn || data?.title || "Ready to Join UNAIC?") : (data?.title || "Siap Bergabung dengan UNAIC?")}
        </h2>
        <p className="text-lg md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
          {isEn ? (data?.descriptionEn || data?.description || "Start your academic journey at UNAIC and realize your bright future dreams.") : (data?.description || "Mulai perjalanan akademik Anda di UNAIC dan wujudkan impian masa depan yang cerah.")}
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          {/* Tombol PMB */}
          <a
            href="https://pmb.universitasalirsyad.ac.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-unaicGold text-unaicNavy font-bold py-4 px-8 md:px-10 rounded-full shadow-[0_0_20px_rgba(252,190,44,0.5)] hover:shadow-[0_0_30px_rgba(252,190,44,0.8)] hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isEn ? "Register Now" : "Daftar Sekarang"}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </a>

          {/* Tombol Informasi */}
          <Link
            href="/pmb/informasi"
            className="px-8 py-4 rounded-full border-2 border-white/30 text-white font-bold hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm"
          >
            {isEn ? "More Information" : "Info Pendaftaran"}
          </Link>

          {/* Tombol Download Brosur */}
          <a
            href="/files/brosur-unaic.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full text-white/80 font-medium hover:text-white hover:underline underline-offset-4 transition-all duration-300"
          >
            {isEn ? "Download Brochure" : "Unduh Brosur"}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
