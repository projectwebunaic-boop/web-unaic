"use client";

import { motion } from "framer-motion";
import { Link } from '@/i18n/routing';
import AgendaCard from "./AgendaCard";
import { Calendar } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface AgendaListProps {
  limit?: number;
  showButton?: boolean;
  data?: any[]; // Accept dynamic data
}

export default function AgendaList({ limit, showButton = false, data = [] }: AgendaListProps) {
  const locale = useLocale();
  const t = useTranslations("Agenda");
  const displayedAgenda = limit ? data.slice(0, limit) : data;

  if (data.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">{t("noAgenda")}</p>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Agenda Timeline */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {displayedAgenda.map((item, index) => (
          <motion.div key={item.id || index} variants={itemVariants} className="h-full">
            <AgendaCard
              title={locale === 'en' ? (item.titleEn || item.title) : item.title}
              slug={item.slug}
              date={item.date}
              location={locale === 'en' ? (item.locationEn || item.location) : item.location}
              description={locale === 'en' ? (item.descriptionEn || item.description) : item.description}
              time={item.time}
              image={item.thumbnail} // Map thumbnail to image
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Show All Button */}
      {showButton && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link
            href="/berita-agenda/agenda"
            className="inline-block px-8 py-3 bg-unaicNavy text-white rounded-lg shadow-md hover:bg-unaicGold hover:text-unaicNavy transition-all duration-300 font-medium"
          >
            {t("viewAll")}
          </Link>
        </motion.div>
      )}
    </div>
  );
}
