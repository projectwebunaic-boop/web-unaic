import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

// const prisma = new PrismaClient();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://universitasalirsyad.ac.id';

    // 1. Fetch Dynamic Routes from Prisma
    let dynamicPosts: MetadataRoute.Sitemap = [];
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            select: { slug: true, updatedAt: true }
        });

        dynamicPosts = posts.map((post: { slug: string; updatedAt: Date }) => ({
            url: `${baseUrl}/berita-agenda/berita/${post.slug}`,
            lastModified: post.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

    } catch (e) {
        console.error("Sitemap error: Prisma not ready or table missing", e);
        // Fallback to static or empty if DB not yet migrated
    }

    // 2. Static Routes
    const staticRoutes: MetadataRoute.Sitemap = [
        '',
        '/tentang',
        '/akademik',
        '/pendaftaran',
        '/berita-agenda/berita',
        '/kontak',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return [...staticRoutes, ...dynamicPosts];
}
