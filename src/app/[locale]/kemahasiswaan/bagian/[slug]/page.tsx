import fs from "fs";
import path from "path";
import HeroSection from "@/components/shared/HeroSection";
import {
    Users, Star, HeartHandshake, Lightbulb, Home,
    Stethoscope, GraduationCap, BookOpen, ChevronLeft, ArrowRight
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";

interface KemahasiswaanData {
    sections: {
        id: string;
        title: string;
        titleEn?: string;
        content: string;
        contentEn?: string;
        icon: string;
        slug: string;
        detail_content: string;
        detail_contentEn?: string;
    }[];
    contact: { whatsapp: string; email: string; address: string; };
}

async function getData(): Promise<KemahasiswaanData | null> {
    const filePath = path.join(process.cwd(), 'src/data/kemahasiswaan_bagian.json');
    if (!fs.existsSync(filePath)) return null;
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
}

const iconMap: Record<string, any> = {
    Users, Star, HeartHandshake, Lightbulb, Home, Stethoscope, GraduationCap, BookOpen
};

export default async function KemahasiswaanSectionDetailPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
    const { slug, locale } = await params;
    const data = await getData();

    if (!data) return notFound();

    const section = data.sections.find(s => s.slug === slug);
    if (!section) return notFound();

    const isEn = locale === 'en';
    const t = (id: string | undefined, en: string | undefined) => isEn && en ? en : id;

    const Icon = iconMap[section.icon] || Users;
    const title = t(section.title, section.titleEn) || "";
    const content = t(section.detail_content, section.detail_contentEn) || "";

    return (
        <main className="font-sans text-gray-700 bg-white min-h-screen">
            <HeroSection
                title={title}
                subtitle={isEn ? "Student Affairs UNAIC" : "Bagian Kemahasiswaan UNAIC"}
                className="bg-gradient-to-br from-blue-800 to-unaicNavy"
            />

            <section className="py-16 sm:py-24">
                <div className="container mx-auto max-w-4xl px-4">
                    <Link
                        href={`/${locale}/kemahasiswaan/bagian`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-bold mb-10 group transition-all"
                    >
                        <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                        {isEn ? "Back to Student Affairs" : "Kembali ke Profil Bagian"}
                    </Link>

                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-blue-900/5 overflow-hidden">
                        <div className="p-8 sm:p-12">
                            <div className="flex flex-col sm:flex-row gap-8 items-start mb-12">
                                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shrink-0 shadow-sm shadow-blue-100">
                                    <Icon size={40} />
                                </div>
                                <div className="space-y-4">
                                    <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                                        {isEn ? "Coaching Division" : "Bidang Pembinaan"}
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl font-extrabold text-unaicNavy leading-tight tracking-tight">
                                        {title}
                                    </h2>
                                </div>
                            </div>

                            <div
                                className="prose prose-lg prose-blue max-w-none text-gray-600 leading-relaxed
                                prose-headings:text-unaicNavy prose-headings:font-bold
                                prose-p:mb-6
                                prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2
                                prose-strong:text-unaicNavy
                                "
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        </div>

                        <div className="bg-gray-50 p-8 sm:p-12 border-t border-gray-100">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                                <div className="space-y-1 text-center sm:text-left">
                                    <p className="font-bold text-unaicNavy">{isEn ? "Need More Information?" : "Butuh Informasi Lebih Lanjut?"}</p>
                                    <p className="text-gray-500 text-sm">{isEn ? "Our team is ready to assist you regarding this program." : "Tim kami siap membantu Anda mengenai program ini."}</p>
                                </div>
                                <Link
                                    href={`https://wa.me/${data.contact?.whatsapp || "6288905905905"}`}
                                    target="_blank"
                                    className="px-8 py-3 bg-unaicNavy text-white font-bold rounded-2xl hover:bg-blue-800 transition-all flex items-center gap-2 shadow-lg hover:shadow-blue-900/20 active:scale-95"
                                >
                                    {isEn ? "Ask on WhatsApp" : "Tanya di WhatsApp"} <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
