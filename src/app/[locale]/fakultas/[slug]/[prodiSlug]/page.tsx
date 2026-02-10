import { GraduationCap, ExternalLink, ArrowLeft, CheckCircle2, Briefcase } from "lucide-react";
import { notFound } from "next/navigation";
import HeroSection from "@/components/shared/HeroSection";
import SectionTitle from "@/components/shared/SectionTitle";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

interface Props {
    params: { locale: string; slug: string; prodiSlug: string };
}

export default async function ProgramDetailPage({ params }: Props) {
    const { locale, slug, prodiSlug } = await params;
    const isEn = locale === 'en';
    const t = await getTranslations("Faculties");

    const program = await prisma.facultyProgram.findFirst({
        where: {
            slug: prodiSlug,
            faculty: { slug }
        },
        include: {
            faculty: true
        }
    }) as any;

    if (!program) {
        notFound();
    }

    const parseJson = (box: any) => {
        if (!box) return [];
        if (typeof box !== 'string') return box;
        try {
            return JSON.parse(box);
        } catch (e) {
            return [];
        }
    };

    const name = isEn ? (program.nameEn || program.name) : program.name;
    const description = isEn
        ? (program.descriptionEn || "Detailed information for this program is being updated.")
        : (program.description || "Informasi detail untuk program ini sedang diperbarui.");

    const advantages = isEn
        ? parseJson(program.advantagesEn)
        : parseJson(program.advantages);

    const careers = isEn
        ? parseJson(program.careerProspectsEn)
        : parseJson(program.careerProspects);

    return (
        <main className="font-sans text-gray-700 bg-white min-h-screen">
            {/* Hero Section */}
            <HeroSection
                title={name}
                subtitle={description.substring(0, 150) + "..."}
            />

            {/* Navigation Breadcrumb-like back button */}
            <div className="container mx-auto px-4 py-6">
                <Link
                    href={`/fakultas/${slug}`}
                    className="inline-flex items-center gap-2 text-unaicNavy hover:text-unaicGold font-medium transition-colors"
                >
                    <ArrowLeft size={18} />
                    {isEn ? `Back to ${program.faculty.nameEn || program.faculty.name}` : `Kembali ke ${program.faculty.name}`}
                </Link>
            </div>

            {/* About Section */}
            <section className="py-12 bg-white">
                <div className="container mx-auto max-w-5xl px-4">
                    <div className="bg-gray-50 rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100">
                        <SectionTitle>{isEn ? "About the Program" : "Tentang Program"}</SectionTitle>
                        <p className="text-lg leading-relaxed text-gray-600 mt-6 whitespace-pre-wrap">
                            {description}
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <span className="bg-unaicNavy text-white px-4 py-2 rounded-full text-sm font-bold">
                                {isEn ? "Level:" : "Jenjang:"} {program.level || "-"}
                            </span>
                            <span className="bg-unaicGold text-unaicNavy px-4 py-2 rounded-full text-sm font-bold">
                                {isEn ? "Accreditation:" : "Akreditasi:"} {program.accreditation || "Baik"}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Advantages Section */}
            {advantages.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="text-center mb-12">
                            <SectionTitle>{isEn ? "Why Choose Us?" : "Keunggulan Program"}</SectionTitle>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {advantages.map((item: any, idx: number) => (
                                <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 bg-unaicBlue/10 rounded-xl flex items-center justify-center mb-6">
                                        <CheckCircle2 className="text-unaicBlue" size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-unaicNavy mb-4">{item.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Career Prospects Section */}
            {careers.length > 0 && (
                <section className="py-16 bg-white">
                    <div className="container mx-auto max-w-4xl px-4">
                        <div className="text-center mb-12">
                            <SectionTitle>{isEn ? "Career Prospects" : "Prospek Karir"}</SectionTitle>
                            <p className="text-gray-500 mt-4">
                                {isEn ? "Graduates of this program have broad opportunities in various sectors:" : "Lulusan program ini memiliki peluang luas di berbagai sektor:"}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {careers.map((career: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                    <div className="shrink-0 w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-unaicBlue">
                                        <Briefcase size={20} />
                                    </div>
                                    <span className="font-medium text-gray-700">{career}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Website Section */}
            {program.websiteUrl && (
                <section className="py-20 bg-unaicNavy text-white">
                    <div className="container mx-auto max-w-4xl px-4 text-center">
                        <h2 className="text-3xl font-bold mb-6">
                            {isEn ? "Explore More on Our Official Website" : "Eksplorasi Lebih Lanjut di Website Resmi"}
                        </h2>
                        <p className="text-gray-300 mb-8 text-lg">
                            {isEn
                                ? "Visit the program's dedicated website for curriculum details, academic calendars, and latest news."
                                : "Kunjungi website khusus program studi untuk detail kurikulum, kalender akademik, dan berita terbaru."}
                        </p>
                        <a
                            href={program.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-unaicGold text-unaicNavy px-10 py-4 rounded-full font-bold text-lg hover:bg-white transition-all transform hover:scale-105"
                        >
                            <ExternalLink size={20} />
                            {isEn ? "Visit Official Website" : "Kunjungi Website Resmi"}
                        </a>
                    </div>
                </section>
            )}

            {/* Simple Footer CTA */}
            {!program.websiteUrl && (
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4 text-center">
                        <SectionTitle>{t("visitWebsite")}</SectionTitle>
                        <button
                            disabled
                            className="mt-6 inline-flex items-center gap-3 bg-gray-300 text-gray-500 px-8 py-4 rounded-full font-semibold text-lg cursor-not-allowed"
                        >
                            🌐 {t("comingSoon")}
                        </button>
                    </div>
                </section>
            )}
        </main>
    );
}
