import React from "react";
import { ShieldCheck, Award, ClipboardCheck, CheckCircle2, Info, ArrowRight } from "lucide-react";
import HeroSection from "@/components/shared/HeroSection";
import { Link } from "@/i18n/routing";
import { getLocale } from "next-intl/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AkreditasiAuditPage() {
    const locale = await getLocale();
    const isEn = locale === 'en';

    // Mock data for initial design (can be moved to DB later)
    const accreditationStatus = {
        title: isEn ? "Institutional Accreditation" : "Akreditasi Institusi",
        grade: "BAIK SEKALI",
        agency: "BAN-PT",
        year: "2023",
        expiry: "2028"
    };

    const sections = [
        {
            title: isEn ? "Internal Quality Audit (AMI)" : "Audit Mutu Internal (AMI)",
            description: isEn
                ? "Routine evaluation process to ensure the implementation of university quality standards."
                : "Proses evaluasi rutin untuk memastikan keterlaksanaan standar mutu universitas.",
            icon: <ClipboardCheck className="text-blue-500" size={32} />,
            href: "/manajemen/penjaminan-mutu/dokumen?category=AMI"
        },
        {
            title: isEn ? "Study Program Accreditation" : "Akreditasi Program Studi",
            description: isEn
                ? "Current accreditation status for all departments under Universitas Al-Irsyad Cilacap."
                : "Status akreditasi terkini untuk seluruh program studi di bawah lingkungan UNAIC.",
            icon: <Award className="text-orange-500" size={32} />,
            href: "/tentang/akreditasi"
        }
    ];

    return (
        <main className="min-h-screen bg-white">
            {/* HERO SECTION */}
            <HeroSection
                title={isEn ? "Accreditation & Audit" : "Akreditasi & Audit"}
                subtitle={isEn ? "Maintaining Excellence through Rigorous Evaluation" : "Menjaga Keunggulan melalui Evaluasi yang Ketat"}
                className="mb-12"
            />

            <div className="max-w-7xl mx-auto px-4 pb-24 space-y-16">

                {/* 1. INSTITUTIONAL STATUS CARD */}
                <section>
                    <div className="bg-unaicNavy rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row">
                        <div className="p-8 md:p-12 md:w-2/3 text-white">
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldCheck className="text-unaicGold" size={32} />
                                <span className="font-bold tracking-widest text-sm uppercase text-white/60">
                                    {isEn ? "Official Status" : "Status Resmi"}
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                {isEn ? "University Accreditation Status" : "Status Akreditasi Universitas"}
                            </h2>
                            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                {isEn
                                    ? "Universitas Al-Irsyad Cilacap is committed to maintaining the highest education standards as recognized by national accreditation agencies."
                                    : "Universitas Al-Irsyad Cilacap berkomitmen untuk mempertahankan standar pendidikan tertinggi sesuai dengan pengakuan lembaga akreditasi nasional."}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-white/40 text-xs uppercase font-bold mb-1">{isEn ? "Agency" : "Lembaga"}</p>
                                    <p className="font-bold text-lg">{accreditationStatus.agency}</p>
                                </div>
                                <div>
                                    <p className="text-white/40 text-xs uppercase font-bold mb-1">{isEn ? "Year" : "Tahun"}</p>
                                    <p className="font-bold text-lg">{accreditationStatus.year}</p>
                                </div>
                                <div>
                                    <p className="text-white/40 text-xs uppercase font-bold mb-1">{isEn ? "Valid Until" : "Berlaku Sampai"}</p>
                                    <p className="font-bold text-lg text-unaicGold">{accreditationStatus.expiry}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-unaicGold/10 md:w-1/3 flex flex-col items-center justify-center p-12 border-l border-white/5">
                            <span className="text-unaicNavy/40 text-xs uppercase font-black mb-2">{isEn ? "Grade" : "Peringkat"}</span>
                            <div className="text-4xl md:text-5xl font-black text-unaicNavy text-center leading-tight">
                                {accreditationStatus.grade}
                            </div>
                            <CheckCircle2 className="text-unaicNavy mt-6" size={48} />
                        </div>
                    </div>
                </section>

                {/* 2. SUB SECTIONS GRID */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sections.map((section, idx) => (
                        <Link
                            key={idx}
                            href={section.href}
                            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
                        >
                            <div>
                                <div className="mb-6">{section.icon}</div>
                                <h3 className="text-2xl font-bold text-unaicNavy mb-4">{section.title}</h3>
                                <p className="text-gray-500 leading-relaxed mb-8">
                                    {section.description}
                                </p>
                            </div>
                            <div className="flex items-center text-unaicBlue font-bold group-hover:gap-2 transition-all">
                                {isEn ? "Explore More" : "Lihat Selengkapnya"} <ArrowRight className="ml-2" size={20} />
                            </div>
                        </Link>
                    ))}
                </section>

                {/* 3. INFO BOX */}
                <section className="bg-blue-50 p-8 rounded-3xl flex items-start gap-6 border border-blue-100">
                    <Info className="text-blue-500 shrink-0 mt-1" size={28} />
                    <div>
                        <h4 className="font-bold text-blue-900 mb-2">{isEn ? "Quality Continuous Improvement" : "Peningkatan Mutu Berkelanjutan"}</h4>
                        <p className="text-blue-800/70 text-sm leading-relaxed">
                            {isEn
                                ? "LJM conducts regular internal audits and external evaluations to ensure that the PPEPP (Establishment, Implementation, Evaluation, Control, and Improvement) cycle is executed effectively across all units."
                                : "LJM melakukan audit internal berkala dan evaluasi eksternal untuk memastikan siklus PPEPP (Penetapan, Pelaksanaan, Evaluasi, Pengendalian, dan Peningkatan) dijalankan secara efektif di seluruh unit."}
                        </p>
                    </div>
                </section>

            </div>
        </main>
    );
}
