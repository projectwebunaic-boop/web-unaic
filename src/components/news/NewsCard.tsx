"use client";

import Image from "next/image";
import { Link } from '@/i18n/routing';
import { motion } from "framer-motion";
import { Calendar, ChevronRight, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { NewsCategory } from "@/types/news";

interface NewsCardProps {
  id: string; // Added ID for key prop if needed
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  date: string;
  category: NewsCategory; // Strict type
  author?: string; // Added author
}

const categoryColors: Record<string, string> = {
  Berita: "bg-blue-100 text-blue-700 border-blue-200",
  Pengumuman: "bg-orange-100 text-orange-700 border-orange-200",
  Agenda: "bg-purple-100 text-purple-700 border-purple-200",
  Karir: "bg-green-100 text-green-700 border-green-200",
};

export default function NewsCard({ title, slug, excerpt, thumbnail, date, category, author }: NewsCardProps) {
  const t = useTranslations("News");
  const badgeClass = categoryColors[category] || "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <motion.article
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 flex flex-col h-full"
      whileHover={{ y: -5 }}
    >
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

        {/* Floating Date Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 text-xs font-semibold text-gray-700">
          <Calendar className="w-3.5 h-3.5 text-unaicGold" />
          {date}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4 flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${badgeClass}`}>
            {category}
          </span>
        </div>

        <Link href={`/berita-agenda/berita/${slug}`} className="group-hover:text-unaicGold transition-colors duration-300">
          <h3 className="font-heading font-bold text-unaicNavy text-xl leading-snug mb-3 line-clamp-2">
            {title}
          </h3>
        </Link>

        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
          {excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
          {author ? (
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <User size={12} />
              </div>
              {author}
            </div>
          ) : (
            <div /> // Spacer
          )}

          <Link
            href={`/berita-agenda/berita/${slug}`}
            className="text-sm font-semibold text-unaicNavy flex items-center gap-1 group/link"
          >
            {t("readMore")}
            <ChevronRight className="w-4 h-4 text-unaicGold transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
