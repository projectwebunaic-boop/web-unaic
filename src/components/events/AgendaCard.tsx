"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, ChevronRight } from "lucide-react";
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from "next-intl";

interface AgendaCardProps {
  title: string;
  slug: string;
  date: string;
  location: string;
  description: string;
  time?: string;
  organizer?: string;
  image?: string;
}

export default function AgendaCard({ title, slug, date, location, description, time, image }: AgendaCardProps) {
  const locale = useLocale();
  const t = useTranslations("Agenda");
  const formatDate = (isoDate: string) => {
    if (!isoDate) return { day: "?", month: "???" };
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date
      .toLocaleString(locale === 'en' ? "en-US" : "id-ID", { month: "short" })
      .toUpperCase();
    return { day, month };
  };

  const { day, month } = formatDate(date);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden flex flex-col h-full border border-gray-100 group"
      whileHover={{ y: -5 }}
    >
      {/* Image & Date Section */}
      <div className="relative h-48 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <CalendarDays className="w-12 h-12 text-gray-300" />
          </div>
        )}

        {/* Date Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg text-center min-w-[60px]">
          <span className="block text-xl font-bold text-unaicNavy leading-none">{day}</span>
          <span className="block text-xs font-bold text-unaicGold uppercase tracking-wider">{month}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-heading font-bold text-unaicNavy text-lg mb-3 line-clamp-2 group-hover:text-unaicBlue transition-colors">
          <Link href={`/berita-agenda/agenda/${slug}`}>
            {title}
          </Link>
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-xs font-medium">
            <CalendarDays className="w-3.5 h-3.5 mr-2 text-unaicBlue" />
            <span>{(() => {
              const dateObj = new Date(date);
              return isNaN(dateObj.getTime()) ? '-' : dateObj.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
            })()}</span>
          </div>
          <div className="flex items-center text-gray-600 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 mr-2 text-unaicBlue" />
            <span>{location}</span>
          </div>
        </div>

        <div
          className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-1"
          dangerouslySetInnerHTML={{
            __html: description
          }}
        />

        <Link
          href={`/berita-agenda/agenda/${slug}`}
          className="mt-auto flex items-center justify-center w-full py-2.5 rounded-xl bg-gray-50 text-unaicNavy font-semibold text-sm group-hover:bg-unaicNavy group-hover:text-white transition-all duration-300"
        >
          {t("readMore")}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </motion.div>
  );
}
