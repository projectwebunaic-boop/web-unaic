export type NewsCategory = 'Berita' | 'Pengumuman' | 'Agenda' | 'Karir';

export interface NewsItem {
    id: string;
    title: string;
    titleEn?: string;
    slug: string;
    content: string; // HTML content or rich text
    contentEn?: string;
    excerpt: string;
    excerptEn?: string;
    thumbnail: string;
    date: string; // ISO Date string or formatted string
    author: string;
    category: NewsCategory;

    // Optional specific fields for Agenda
    eventDate?: string;
    location?: string;

    // Optional metadata for SEO/CMS
    tags?: string[];
    isFeatured?: boolean;
}
