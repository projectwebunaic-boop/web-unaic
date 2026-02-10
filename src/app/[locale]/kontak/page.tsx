"use client";

import React from "react";
import HeroSection from "@/components/shared/HeroSection";
import Contact from "@/components/home/Contact";
import { MessageSquareWarning, FileText, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations('Contact');
  return (
    <main className="font-sans text-gray-700 bg-white">
      {/* Hero Section */}
      <HeroSection
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
      />

      {/* Intro Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-unaicBlue/10 text-unaicBlue rounded-full flex items-center justify-center mb-4">
                <MessageSquareWarning size={24} />
              </div>
              <h3 className="font-bold text-unaicNavy text-lg mb-2">{t('cards.complaint.title')}</h3>
              <p className="text-gray-600 text-sm">
                {t('cards.complaint.desc')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-unaicGold/10 text-unaicGold rounded-full flex items-center justify-center mb-4">
                <FileText size={24} />
              </div>
              <h3 className="font-bold text-unaicNavy text-lg mb-2">{t('cards.info.title')}</h3>
              <p className="text-gray-600 text-sm">
                {t('cards.info.desc')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <HelpCircle size={24} />
              </div>
              <h3 className="font-bold text-unaicNavy text-lg mb-2">{t('cards.technical.title')}</h3>
              <p className="text-gray-600 text-sm">
                {t('cards.technical.desc')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Contact Component (Reused from Home for consistency) */}
      <Contact />

    </main>
  );
}
