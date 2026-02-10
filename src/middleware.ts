import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // 1. WordPress Migration Redirects (301)
    // Legacy URLs like /?p=123
    const wpPostId = searchParams.get('p');
    if (wpPostId) {
        // Redirect to new news listing or specific post if mapping exists
        return NextResponse.redirect(new URL('/id/berita', request.url), 301);
    }

    // Legacy categories or dates
    if (pathname.includes('/category/') || /^\/\d{4}\/\d{2}\/.*$/.test(pathname)) {
        return NextResponse.redirect(new URL('/id/berita', request.url), 301);
    }

    // 2. Legacy Mitra Redirects
    if (pathname.includes('/mitra') && !pathname.includes('/tentang/mitra')) {
        const newPathname = pathname.replace('/mitra', '/tentang/mitra');
        return NextResponse.redirect(new URL(newPathname, request.url), 301);
    }

    // 3. New News Route Redirect
    // Redirect /berita to /berita-agenda/berita (except if it already starts with /berita-agenda)
    // We check if pathname contains /berita but NOT /berita-agenda (to avoid double prefixing like /berita-agenda/agenda -> /berita-agenda/berita-agenda/agenda)
    // And also need to be careful with /admin/berita if it exists (it doesn't seem so based on adminMenu) -> admin uses /admin/news
    // 3. New News Route Redirect
    if (pathname.includes('/berita') && !pathname.includes('/berita-agenda') && !pathname.includes('/admin/')) {
        const newPathname = pathname.replace('/berita', '/berita-agenda/berita');
        return NextResponse.redirect(new URL(newPathname, request.url), 301);
    }

    // 4. Admin Authentication Protection
    // Protect all /admin routes except /admin/login
    // Also exclude /api routes to avoid HTML redirects on API calls (redundant if matcher works, but safe)
    if (pathname.includes('/admin') && !pathname.includes('/login') && !pathname.startsWith('/api')) {
        // Check for auth cookie
        const authCookie = request.cookies.get('unaic_admin_auth');

        if (!authCookie) {
            // Redirect to login page
            const locale = pathname.match(/^\/(id|en|ar)/)?.[1] || 'id';
            return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
        }
    }

    return intlMiddleware(request);
}

export const config = {
    // Match only internationalized pathnames
    matcher: ['/((?!api|_next|.*\\..*).*)']
};

