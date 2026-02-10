import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import HeroSection from "@/components/shared/HeroSection";
import { ArrowRight, GraduationCap, Users, BookOpen } from "lucide-react";
import prisma from "@/lib/prisma";
import * as Icons from "lucide-react";

interface Props {
  params: { locale: string };
}

export default async function FacultiesPage({ params }: Props) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const dbFaculties = await prisma.faculty.findMany({
    include: {
      programs: true
    },
    orderBy: { name: 'asc' }
  });

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <HeroSection
        title={isEn ? "Faculties & Study Programs" : "Fakultas & Program Studi"}
        subtitle={isEn
          ? "Academic excellence center with 3 main Faculties and various accredited study programs."
          : "Pusat keunggulan akademik dengan 3 Fakultas utama dan berbagai program studi terakreditasi."}
        backgroundImage="/images/hero-bg.jpg"
      />

      <div className="relative z-10 -mt-10 mb-20 px-6">
        <div className="container mx-auto">
          {/* Stats / Intro Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-unaicGold flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-unaicNavy rounded-full"><GraduationCap size={24} /></div>
              <div>
                <h3 className="font-bold text-unaicNavy text-lg">{isEn ? "3 Faculties" : "3 Fakultas"}</h3>
                <p className="text-sm text-gray-500">{isEn ? "Excellent & Trusted" : "Unggul & Terpercaya"}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-unaicBlue flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-unaicBlue rounded-full"><BookOpen size={24} /></div>
              <div>
                <h3 className="font-bold text-unaicNavy text-lg">15+ {isEn ? "Programs" : "Prodi"}</h3>
                <p className="text-sm text-gray-500">{isEn ? "D3, D4, S1, Profession" : "Jenjang D3, D4, S1, Profesi"}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-green-500 flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-full"><Users size={24} /></div>
              <div>
                <h3 className="font-bold text-unaicNavy text-lg">{isEn ? "Expert & Competent" : "Ahli & Kompeten"}</h3>
                <p className="text-sm text-gray-500">{isEn ? "Practitioner & Academic Lecturers" : "Dosen Praktisi & Akademisi"}</p>
              </div>
            </div>
          </div>

          {/* Faculty Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {dbFaculties.map((faculty, index) => {
              // Dynamic icon matching Lucide icons
              const IconComponent = (Icons as any)[faculty.icon || "BookOpen"] || Icons.BookOpen;

              return (
                <div
                  key={faculty.id}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className={`h-24 bg-gradient-to-r ${index % 3 === 0 ? 'from-pink-600 to-rose-500' :
                    index % 3 === 1 ? 'from-blue-600 to-cyan-500' :
                      'from-amber-500 to-orange-500'
                    } p-6 relative overflow-hidden`}
                  >
                    <div className="absolute right-0 top-0 opacity-20 transform translate-x-4 -translate-y-4">
                      <IconComponent size={100} className="text-white rotate-12" />
                    </div>
                    <div className="relative z-10 w-12 h-12 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white border border-white/30 shadow-inner">
                      <IconComponent size={28} />
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-unaicNavy transition-colors">
                      {isEn ? (faculty.nameEn || faculty.name) : faculty.name}
                    </h2>
                    <div className="w-12 h-1 bg-gray-200 rounded-full mb-6 group-hover:bg-unaicGold transition-all duration-500 group-hover:w-20"></div>

                    <div className="flex-1 space-y-3 mb-8">
                      {faculty.programs.slice(0, 5).map((program) => (
                        <Link
                          key={program.id}
                          href={`/fakultas/${faculty.slug}/${program.slug}`}
                          className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-transparent hover:border-blue-100 hover:bg-blue-50 group/item transition-all"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/item:bg-blue-500 transition-colors"></span>
                          <span className="text-sm font-medium text-gray-600 group-hover/item:text-blue-700 line-clamp-1">
                            {isEn ? (program.nameEn || program.name) : program.name}
                          </span>
                        </Link>
                      ))}
                      {faculty.programs.length > 5 && (
                        <p className="text-xs text-gray-400 text-center italic">
                          +{faculty.programs.length - 5} {isEn ? "other programs" : "program lainnya"}
                        </p>
                      )}
                    </div>

                    <Link
                      href={`/fakultas/${faculty.slug}`}
                      className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-white transition-all bg-unaicNavy hover:bg-unaicGold hover:text-unaicNavy shadow-md hover:shadow-lg"
                    >
                      {isEn ? "Explore Faculty" : "Jelajahi Fakultas"} <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
