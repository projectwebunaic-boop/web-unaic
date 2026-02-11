import prisma from "@/lib/prisma";
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { Link } from "@/i18n/routing";
import {
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Microscope,
  Mail,
  Quote,
  Building2,
  Globe,
  Award
} from 'lucide-react';
import { getTranslations } from "next-intl/server";
import { ProfileContent } from "./ProfileContent";

export default async function LeaderDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug, locale } = await params;
  console.log('🔍 Leader Slug:', slug, 'Locale:', locale);

  const t = await getTranslations({ locale, namespace: "Leaders" });
  const isEn = locale === 'en';

  const leaderData = await prisma.leader.findUnique({
    where: { slug }
  });
  console.log('leaderData found:', !!leaderData);

  if (!leaderData) {
    notFound();
  }

  // Manual JSON parsing for SQLite compatibility
  const parseJson = (box: string | null) => {
    if (!box) return [];
    try {
      const parsed = JSON.parse(box);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  const leader = {
    ...leaderData,
    education: parseJson(leaderData.education),
    educationEn: parseJson(leaderData.educationEn),
    career: parseJson(leaderData.career),
    careerEn: parseJson(leaderData.careerEn),
    research: parseJson(leaderData.research),
    researchEn: parseJson(leaderData.researchEn),
  };

  const category = leader.category;

  if (!leader) {
    notFound();
  }

  const leaderForContent = {
    ...leader,
    titleEn: leader.titleEn || undefined,
    vision: leader.vision || undefined,
    visionEn: leader.visionEn || undefined,
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* 
        HERO SECTION 
        - Simpler, cleaner, focuses on the "Profil Pimpinan" context
      */}
      <div className="relative w-full bg-unaicNavy flex flex-col items-center px-4 overflow-hidden pt-40 pb-32 md:pb-40">
        <div className="absolute inset-0 bg-[url('/patterns/circuit.svg')] opacity-[0.03]"></div>

        {/* Soft Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-unaicBlue/20 to-unaicNavy"></div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 w-full leading-none z-10 translate-y-1">
          <svg className="w-full h-16 md:h-24 lg:h-32 text-gray-50 fill-current" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="relative z-20 max-w-5xl mx-auto w-full text-center md:text-left flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
          <div className="text-center md:text-left">
            <Link
              href={`/${locale}/manajemen/pimpinan`}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium mb-4 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>{t("backToList")}</span>
            </Link>
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-white tracking-tight">
              {t("heroTitle")}
            </h1>
            <p className="text-white/60 mt-2 text-lg font-light">
              {t("heroSubtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-30 -mt-24 md:-mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* 
            LEFT COLUMN : Profile Card & Simple Contact
            - Overlaps the banner significantly
          */}
          <div className="lg:col-span-4 lg:sticky lg:top-8">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden ring-1 ring-black/5">
              <div className="relative aspect-[3/4] bg-gray-100 group">
                <img
                  src={leader.image || "/images/placeholder-user.png"}
                  alt={leader.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white pb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-unaicGold text-unaicNavy text-xs font-bold rounded-full uppercase tracking-wider">
                      {locale === 'en' ? (t(`category.${leader.category}`) || leader.category) : leader.category}
                    </span>
                    {category === 'Rektor' && (
                      <span className="flex items-center gap-1.5 text-xs font-medium bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        <Award size={12} className="text-yellow-400" />
                        {t("topLeader")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information Quick View */}
              <div className="p-6 md:p-8 bg-white space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{t("contactInfo")}</h3>
                  <ul className="space-y-4">
                    {leader.email && (
                      <li>
                        <a href={`mailto:${leader.email}`} className="flex items-start gap-4 group">
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <Mail size={18} />
                          </div>
                          <div>
                            <span className="block text-xs text-gray-400 font-medium mb-0.5">{t("officialEmail")}</span>
                            <span className="block text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors break-all">{leader.email}</span>
                          </div>
                        </a>
                      </li>
                    )}
                    <li>
                      <div className="flex items-start gap-4 group cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <Building2 size={18} />
                        </div>
                        <div>
                          <span className="block text-xs text-gray-400 font-medium mb-0.5">{t("office")}</span>
                          <span className="block text-sm font-semibold text-gray-700">{t("officeLocation")}</span>
                        </div>
                      </div>
                    </li>
                    {leader.scholar && (
                      <li>
                        <a href={leader.scholar} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 group-hover:text-white transition-all">
                            <Globe size={18} />
                          </div>
                          <div>
                            <span className="block text-xs text-gray-400 font-medium mb-0.5">{t("researchPub")}</span>
                            <span className="block text-sm font-semibold text-gray-700 group-hover:text-green-700 transition-colors">{t("scholarProfile")}</span>
                          </div>
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 
            RIGHT COLUMN : Details
            - Pushed down using `mt` to ensure it starts BELOW the wave visually
            - Currently set to `lg:mt-24` to give breathing room
          */}
          <div className="lg:col-span-8 lg:mt-32 space-y-10">
            <ProfileContent leader={leaderForContent} locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}


