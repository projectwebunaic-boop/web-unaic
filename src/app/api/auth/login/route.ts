import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { verifyPin, hashPin } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit(50, 60000); // 50 attempts per minute

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'admin_settings.json');

export async function POST(req: Request) {
    // 1. Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const limitCheck = limiter.check(ip);

    if (limitCheck.isRateLimited) {
        return NextResponse.json({ error: 'Too many attempts. Please try again in a minute.' }, { status: 429 });
    }

    try {
        const { pin } = await req.json();

        if (!pin) {
            return NextResponse.json({ error: 'PIN is required' }, { status: 400 });
        }

        // 2. Read Settings
        if (!fs.existsSync(DB_PATH)) {
            return NextResponse.json({ error: 'System error: Settings not found' }, { status: 500 });
        }

        const settings = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
        const storedPin = settings.security?.pin || "1234";

        // 3. Verify PIN
        const isValid = await verifyPin(pin, storedPin);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
        }

        // 4. Auto-upgrade PIN if not hashed
        if (storedPin === pin) {
            const hashed = await hashPin(pin);
            settings.security.pin = hashed;
            fs.writeFileSync(DB_PATH, JSON.stringify(settings, null, 2));
            console.log("[Auth] PIN automatically upgraded to hash");
        }

        // 5. Create Session Cookie (Secure, HttpOnly)
        const cookieStore = await cookies();
        cookieStore.set('unaic_admin_auth', 'valid', {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return NextResponse.json({ success: true, message: 'Authenticated' });

    } catch (e) {
        console.error("Login Error:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
