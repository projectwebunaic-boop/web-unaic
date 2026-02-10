import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import HeroSection from "@/components/shared/HeroSection";
import { Button } from "@/components/shared/Button";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Phone } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

// Force dynamic to ensure we always get the latest JSON data
export const dynamic = 'force-dynamic';

interface Service {
    id: string;
    title: string;
    titleEn?: string;
    description: string;
    descriptionEn?: string;
    link: string;
    icon: string;
    slug?: string;
    content?: string;
    contentEn?: string;
}

interface BAAKData {
    services: Service[];
    contact: {
        address: string;
        whatsapp: string;
        email: string;
    };
}

async function getBAAKData(): Promise<BAAKData> {
    const filePath = path.join(process.cwd(), 'src/data/baak.json');
    if (!fs.existsSync(filePath)) {
        return {
            services: [],
            contact: { address: '', whatsapp: '', email: '' }
        };
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const locale = await getLocale();
    const t = await getTranslations("BAAK.detail");

    const data = await getBAAKData();
    const service = data.services.find(s => s.slug === slug);

    if (!service) {
        notFound();
    }

    const displayTitle = locale === 'en' ? (service.titleEn || service.title) : service.title;
    const displayContent = locale === 'en' ? (service.contentEn || service.content) : service.content;

    return (
        <main className="font-sans text-gray-700 bg-white min-h-screen">
            <HeroSection
                title={displayTitle}
                subtitle={t("subtitle")}
                className="bg-gradient-to-r from-unaicNavy to-unaicBlue"
            />

            <section className="py-16 md:py-24">
                <div className="container mx-auto max-w-4xl px-4">
                    <Link href="/manajemen/baak" className="inline-flex items-center text-unaicBlue hover:text-unaicNavy font-semibold mb-8 transition-colors">
                        <ArrowLeft className="mr-2" size={20} /> {t("backAuth")}
                    </Link>

                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-8 md:p-12">
                            <h1 className="text-3xl md:text-4xl font-bold text-unaicNavy mb-6">{displayTitle}</h1>

                            {/* Content Render */}
                            <div className="prose prose-lg max-w-none text-gray-600 prose-headings:text-unaicNavy prose-a:text-unaicBlue prose-li:marker:text-unaicGold prose-ol:list-decimal prose-ul:list-disc prose-li:pl-2"
                                dangerouslySetInnerHTML={{ __html: displayContent || "<p>Belum ada informasi detail untuk layanan ini.</p>" }}
                            />
                        </div>

                        {/* Contact Widget */}
                        <div className="bg-gray-50 p-8 border-t border-gray-100">
                            <h3 className="text-xl font-bold text-unaicNavy mb-4">{t("helpTitle")}</h3>
                            <p className="text-gray-600 mb-6">{t("helpDesc")}</p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                                    <a href={`https://wa.me/${data.contact?.whatsapp || "6288905905905"}?text=${encodeURIComponent(locale === 'en' ? `Hello BAAK, I want to ask about ${displayTitle}...` : `Halo BAAK, saya ingin bertanya tentang ${displayTitle}...`)}`} target="_blank" rel="noopener noreferrer">
                                        <Phone className="mr-2 h-4 w-4" /> {t("contactWa")}
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
