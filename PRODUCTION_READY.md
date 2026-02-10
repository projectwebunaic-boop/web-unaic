# Production Readiness: Security & CORS

## 1. Security Headers (Helmet.js Equivalent)
I have configured standard security headers in `next.config.ts`. This protects your application from common attacks like Clickjacking and MIME-sniffing.

**Configured Headers:**
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## 2. CORS Configuration
In Next.js, CORS is best handled via Middleware or per-route if you only need it for specific endpoints.

### Global CORS (Middleware)
If you need to allow specific domains (e.g., a separate mobile app or frontend) to access your API:

```typescript
// src/middleware.ts modification
const allowedOrigins = ['https://yourdomain.com', 'https://anotherdomain.com'];

export default function middleware(request: NextRequest) {
    const origin = request.headers.get('origin');
    
    // Check if origin is allowed
    if (origin && !allowedOrigins.includes(origin)) {
        return new NextResponse(null, { status: 403, statusText: 'Forbidden' });
    }

    const response = intlMiddleware(request); // or your existing logic

    if (origin && allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    return response;
}
```

## 3. Deployment with PM2
Use the `ecosystem.config.js` I've provided to run your app in production:
```bash
pm2 start ecosystem.config.js
pm2 save
```
This will:
- Run in **cluster mode** (using all CPU cores).
- **Restart automatically** if the app crashes or RAM exceeds 1GB.
- Ensure the app starts on server reboot.
