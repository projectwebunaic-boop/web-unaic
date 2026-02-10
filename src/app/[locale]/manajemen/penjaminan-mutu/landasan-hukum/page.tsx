import { FileText, Download, Scale, ExternalLink, Building, ShieldCheck, Globe } from "lucide-react";
import HeroSection from "@/components/shared/HeroSection";
import prisma from "@/lib/prisma";
import { getLocale } from "next-intl/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getData() {
    return await prisma.lpmLegalBasis.findMany({
        orderBy: { order: 'asc' }
    });
}

export default async function LandasanHukumPage() {
    const locale = await getLocale();
    const data = await getData();
    const isEn = locale === 'en';

    return (
        <main className="min-h-screen bg-white">
            {/* HERO SECTION */}
            <HeroSection
                title={isEn ? "Legal Basis" : "Landasan Hukum"}
                subtitle={isEn ? "Institutional and National Regulations for Quality Assurance" : "Regulasi Institusi dan Nasional dalam Penjaminan Mutu"}
                className="mb-12"
            />

            <div className="max-w-7xl mx-auto px-4 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar Information */}
                    <div className="lg:col-span-1">
                        <div className="bg-unaicNavy p-8 rounded-3xl text-white sticky top-24">
                            <Scale className="text-unaicGold mb-6" size={48} />
                            <h2 className="text-2xl font-bold mb-4">{isEn ? "Legal Compliance" : "Kepatuhan Hukum"}</h2>
                            <p className="text-gray-300 leading-relaxed mb-6">
                                {isEn
                                    ? "LJM ensures that all academic and non-academic processes comply with the prevailing laws and regulations of the Republic of Indonesia and University statutes."
                                    : "LJM memastikan seluruh proses akademik dan non-akademik berjalan sesuai dengan peraturan perundang-undangan RI serta statuta universitas yang berlaku."}
                            </p>
                            <div className="pt-6 border-t border-white/10 space-y-4">
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <div className="w-2 h-2 bg-unaicGold rounded-full"></div>
                                    {isEn ? "National Standards" : "Standar Nasional (SN-Dikti)"}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <div className="w-2 h-2 bg-unaicGold rounded-full"></div>
                                    {isEn ? "University Statutes" : "Statuta Universitas"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Grouped Document List */}
                    <div className="lg:col-span-2 space-y-12">
                        {[
                            {
                                id: 'Nasional',
                                title: isEn ? "National Legal Basis" : "Landasan Hukum Nasional",
                                description: isEn ? "Statutes and regulations from the Republic of Indonesia." : "Undang-undang dan peraturan perundang-undangan Republik Indonesia.",
                                icon: <Globe className="text-green-600" size={24} />
                            },
                            {
                                id: 'Perguruan Tinggi',
                                title: isEn ? "University Legal Basis" : "Landasan Hukum Perguruan Tinggi",
                                description: isEn ? "Statutes and internal regulations of Universitas Al-Irsyad Cilacap." : "Statuta dan peraturan internal Universitas Al-Irsyad Cilacap.",
                                icon: <Building className="text-purple-600" size={24} />
                            },
                            {
                                id: 'LJM',
                                title: isEn ? "LJM Legal Basis" : "Landasan Hukum LJM",
                                description: isEn ? "Specific policies and guidelines of the Quality Assurance Institute." : "Kebijakan dan pedoman khusus Lembaga Jaminan Mutu.",
                                icon: <ShieldCheck className="text-blue-600" size={24} />
                            }
                        ].map((section) => {
                            const sectionDocs = data.filter(d => (d.category || 'Nasional') === section.id);

                            return (
                                <section key={section.id} className="space-y-6">
                                    <div className="flex items-center gap-4 border-b pb-4">
                                        <div className="p-3 bg-gray-50 rounded-xl">
                                            {section.icon}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-unaicNavy">{section.title}</h2>
                                            <p className="text-sm text-gray-500">{section.description}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        {sectionDocs.length > 0 ? (
                                            sectionDocs.map((item) => (
                                                <div key={item.id} className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-start gap-6">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-unaicNavy transition-colors">
                                                        <FileText className="text-unaicNavy group-hover:text-white transition-colors" size={24} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-unaicNavy mb-1">
                                                            {isEn ? (item.titleEn || item.title) : item.title}
                                                        </h3>
                                                        {(isEn ? (item.descriptionEn || item.description) : item.description) && (
                                                            <p className="text-gray-500 text-xs mb-3 leading-relaxed">
                                                                {isEn ? (item.descriptionEn || item.description) : item.description}
                                                            </p>
                                                        )}
                                                        {item.url && (
                                                            <a
                                                                href={item.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 text-unaicBlue font-bold text-xs hover:underline"
                                                            >
                                                                <Download size={14} /> {isEn ? "Download Document" : "Unduh Dokumen"}
                                                            </a>
                                                        )}
                                                    </div>
                                                    <div className="hidden sm:block">
                                                        <ExternalLink size={18} className="text-gray-200" />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400">
                                                <FileText size={32} className="opacity-20 mb-2" />
                                                <p className="text-xs">{isEn ? "No documents in this category." : "Belum ada dokumen di kategori ini."}</p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                </div>
            </div>
        </main>
    );
}
