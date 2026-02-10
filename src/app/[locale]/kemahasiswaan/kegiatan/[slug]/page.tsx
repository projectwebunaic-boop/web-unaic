"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { Calendar, MapPin, ArrowLeft, Share2 } from "lucide-react";
import HeroSection from "@/components/shared/HeroSection";
import { useLocale } from "next-intl";

interface Activity {
    id: string;
    title: string;
    titleEn?: string;
    description: string;
    descriptionEn?: string;
    content: string;
    contentEn?: string;
    date: string;
    dateEn?: string;
    location: string;
    locationEn?: string;
    image: string;
    category: string;
    slug: string;
}

export default function ActivityDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug as string;
    const locale = useLocale();
    const isEn = locale === 'en';

    const [activity, setActivity] = useState<Activity | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await fetch("/api/admin/activities");
                if (res.ok) {
                    const data: Activity[] = await res.json();
                    const found = data.find(item => item.slug === slug);
                    if (found) {
                        setActivity(found);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch activity");
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) fetchDetail();
    }, [slug]);

    // Helper for localized text
    const tx = (id?: string | null, en?: string | null) => (isEn && en) ? en : (id || "");

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-unaicBlue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!activity) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    {isEn ? "Activity Not Found" : "Kegiatan Tidak Ditemukan"}
                </h1>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-6 py-3 bg-unaicNavy text-white rounded-xl hover:bg-unaicBlue transition"
                >
                    <ArrowLeft size={20} /> {isEn ? "Back" : "Kembali"}
                </button>
            </div>
        );
    }

    const title = tx(activity.title, activity.titleEn);
    const date = tx(activity.date, activity.dateEn);
    const location = tx(activity.location, activity.locationEn);
    const content = tx(activity.content, activity.contentEn) || `<p>${tx(activity.description, activity.descriptionEn)}</p>`;

    return (
        <main className="bg-white font-sans text-gray-700 pb-20">
            {/* Custom Hero for Detail */}
            <div className="relative h-[50vh] min-h-[400px] w-full bg-unaicNavy">
                <Image
                    src={activity.image}
                    alt={title}
                    fill
                    className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-unaicNavy via-unaicNavy/50 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 container mx-auto">
                    <span className="inline-block px-4 py-1 rounded-full bg-unaicGold text-unaicNavy font-bold text-sm mb-4">
                        {activity.category}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight max-w-4xl">
                        {title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-white/90">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-unaicGold" />
                            <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-unaicGold" />
                            <span>{location}</span>
                        </div>
                    </div>
                </div>
            </div>

            <article className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-8 flex items-center gap-2 text-unaicNavy font-bold hover:text-unaicBlue transition group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    {isEn ? "Back to Activity List" : "Kembali ke Daftar Kegiatan"}
                </button>

                <div
                    className="prose prose-lg max-w-none text-gray-600 prose-headings:text-unaicNavy prose-a:text-unaicBlue"
                    dangerouslySetInnerHTML={{ __html: content }}
                />

                <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
                    <h4 className="font-bold text-gray-800">
                        {isEn ? "Share This Activity:" : "Bagikan Kegiatan Ini:"}
                    </h4>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition">
                        <Share2 size={18} />
                        Share
                    </button>
                </div>
            </article>
        </main>
    );
}
