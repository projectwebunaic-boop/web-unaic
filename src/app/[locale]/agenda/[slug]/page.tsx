'use client';

import { notFound } from "next/navigation";
import { Link } from '@/i18n/routing';
import { use } from "react";
import { getNewsBySlug, getAllNews } from "@/data/berita";
import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";
import { CalendarDays, MapPin, User, ArrowLeft, Clock } from "lucide-react";
import { NewsCategory } from "@/types/news";

interface AgendaDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function AgendaDetailPage({ params }: AgendaDetailPageProps) {
  const { slug } = use(params);
  const item = getNewsBySlug(slug);

  if (!item || item.category !== 'Agenda') {
    notFound();
  }

  // Get related agenda
  const relatedAgenda = getAllNews('Agenda')
    .filter((a) => a.slug !== slug)
    .slice(0, 3);

  // Fallback/Parsing for display
  const eventTime = "08:00 - 16:00 WIB"; // Default if not in data (should be added to NewsItem if critical)
  const eventLocation = item.location || "Kampus UNAIC";

  return (
    <main className="min-h-screen bg-white text-gray-800">
      <HeroSection title="Agenda UNAIC" subtitle={item.title} />

      <div className="max-w-4xl mx-auto py-10 px-4">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/agenda"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-unaicNavy rounded-full hover:bg-unaicNavy hover:text-white transition-all duration-300 font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Agenda
          </Link>
        </div>

        {/* Main Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-10">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full object-cover max-h-[500px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <span className="bg-unaicGold text-unaicNavy text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
              {item.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">{item.title}</h1>
          </div>
        </div>

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          {/* Date */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-full text-blue-600">
              <CalendarDays size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Tanggal</h3>
              <p className="text-gray-600 text-sm">{item.date}</p>
            </div>
          </div>

          {/* Time (using fallback or real data if added to types) */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md flex items-start gap-4">
            <div className="bg-purple-50 p-3 rounded-full text-purple-600">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Waktu</h3>
              <p className="text-gray-600 text-sm">{eventTime}</p>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md flex items-start gap-4">
            <div className="bg-red-50 p-3 rounded-full text-red-600">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Lokasi</h3>
              <p className="text-gray-600 text-sm">{eventLocation}</p>
            </div>
          </div>
        </div>


        {/* Description - Enhanced Typography */}
        <div
          className="prose prose-lg max-w-none text-gray-600 leading-relaxed mb-12 p-6 md:p-10 bg-white shadow-xl shadow-gray-100 rounded-2xl border border-gray-50"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />

        {/* Organizer info */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 mb-10 max-w-md">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            <User size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">Penyelenggara</p>
            <p className="text-sm font-medium text-gray-900">{item.author}</p>
          </div>
        </div>

        {/* Related Agenda */}
        {relatedAgenda.length > 0 && (
          <section className="border-t border-gray-200 pt-12">
            <SectionTitle>Agenda Terkait</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {relatedAgenda.map((related) => (
                <div key={related.slug} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={related.thumbnail}
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-700 items-center flex gap-1">
                      <CalendarDays size={12} /> {related.date}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-unaicNavy text-lg mb-2 line-clamp-2 group-hover:text-unaicGold transition-colors">
                      <Link href={`/agenda/${related.slug}`}>
                        {related.title}
                      </Link>
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <MapPin className="w-3 h-3 mr-1" />
                      {related.location || "Kampus UNAIC"}
                    </div>
                    <Link
                      href={`/agenda/${related.slug}`}
                      className="text-sm font-semibold text-unaicBlue flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Detail Agenda <ArrowLeft className="w-3 h-3 rotate-180" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
