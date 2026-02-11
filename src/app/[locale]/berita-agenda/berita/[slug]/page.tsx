import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft, User, Calendar, Megaphone, Briefcase, Newspaper } from "lucide-react";
import HeroSection from "@/components/shared/HeroSection";

interface PageProps {
    params: Promise<{ slug: string; locale: string }>;
}

export const dynamic = 'force-dynamic';

export default async function NewsDetailPage({ params }: PageProps) {
    const { slug, locale } = await params;
    const t = await getTranslations("News");
    const isEn = locale === 'en';

    const post = await prisma.post.findUnique({
        where: { slug }
    });

    if (!post) {
        notFound();
    }

    const title = isEn ? (post.titleEn || post.title) : post.title;
    const content = isEn ? (post.contentEn || post.content) : post.content;
    const image = post.image || '/images/placeholder.jpg';
    const author = post.author || 'Admin'; // Default author

    // Format date correctly
    const postDate = new Date(post.createdAt);
    const formattedDate = new Intl.DateTimeFormat(isEn ? 'en-US' : 'id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(postDate);

    const CategoryIcon = {
        'Pengumuman': <Megaphone size={16} />,
        'Karir': <Briefcase size={16} />,
        'Berita': <Newspaper size={16} />
    }[post?.category || 'Berita'] || <Newspaper size={16} />;

    return (
        <main className="bg-white font-sans text-gray-700 min-h-screen">
            {/* Hero Section */}
            <div className="relative w-full h-[50vh] min-h-[400px]">
                {image && (
                    <Image
                        src={image}
                        alt={title || "News Image"}
                        fill
                        className="object-cover"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-16">
                    <div className="container mx-auto max-w-5xl">
                        {/* Metadata Badges */}
                        <div className="flex flex-wrap items-center gap-3 mb-4 animate-fade-in-up">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-unaicGold text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                                {CategoryIcon}
                                {post.category}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/30">
                                <Calendar size={14} />
                                {formattedDate}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg font-heading animate-fade-in-up delay-100">
                            {title}
                        </h1>

                        <div className="flex items-center gap-3 text-white/90 text-sm font-medium animate-fade-in-up delay-200">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                                <User size={16} />
                            </div>
                            <span>{author}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 py-12 lg:py-16 max-w-4xl">
                <Link
                    href="/berita-agenda/berita"
                    className="inline-flex items-center gap-2 text-unaicNavy font-semibold hover:text-unaicGold transition-all mb-8 group"
                >
                    <div className="p-2 rounded-full bg-gray-100 group-hover:bg-unaicGold/10 transition-colors">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    </div>
                    {t('backToNews')}
                </Link>

                <article className="prose prose-lg prose-unaic max-w-none text-gray-600 prose-headings:text-unaicNavy prose-a:text-unaicGold hover:prose-a:text-unaicNavy prose-img:rounded-2xl prose-img:shadow-lg">
                    {/* If content is just plain text, render it. But usually HTML from WYSIWYG */}
                    <div dangerouslySetInnerHTML={{ __html: content || "" }} />
                </article>
            </div>
        </main>
    );
}
