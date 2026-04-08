import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limiter — only blocks extreme abuse
const rateMap = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 600;  // 10 req/sec sustained — very generous for real users
const STRICT_MAX = 200;    // API routes

// Suspicious URL patterns — path traversal, SQL injection, common exploit probes
const ATTACK_PATTERNS = [
  /\.\.\//,                        // path traversal
  /(\%2e\%2e|\.\.%2f|%2e\.)/i,    // encoded path traversal
  /<script/i,                       // XSS
  /union\s+select/i,               // SQL injection
  /exec(\s|\+)+(s|x)p\w+/i,       // SQL exec
  /;\s*(drop|alter|delete)\s+/i,   // SQL destructive
  /\beval\s*\(/i,                  // eval injection
  /etc\/passwd/i,                   // LFI
  /\/wp-admin/i,                    // WordPress probe
  /\/phpmy/i,                       // phpMyAdmin probe
  /\/\.env/,                        // env file probe
  /\/\.git/,                        // git exposure
];

function getIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown';
}

function isRateLimited(ip: string, isApi: boolean): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  const limit = isApi ? STRICT_MAX : MAX_REQUESTS;

  if (!entry || now - entry.ts > WINDOW_MS) {
    rateMap.set(ip, { count: 1, ts: now });
    return false;
  }

  entry.count++;
  if (entry.count > limit) return true;
  return false;
}

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const ip = getIp(req);
  const fullUrl = pathname + search;
  const isApi = pathname.startsWith('/api/');

  // ── 1. Attack pattern detection ──────────────────────────────────────────
  for (const pattern of ATTACK_PATTERNS) {
    if (pattern.test(fullUrl) || pattern.test(decodeURIComponent(fullUrl))) {
      // Silently alert admin (fire-and-forget)
      fetch(`${req.nextUrl.origin}/api/security/alert`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          type: 'scrape',
          page: fullUrl,
          ua: req.headers.get('user-agent') || 'unknown',
        }),
      }).catch(() => {});

      return new NextResponse('Forbidden', {
        status: 403,
        headers: securityHeaders(),
      });
    }
  }

  // ── 2. Rate limiting ──────────────────────────────────────────────────────
  if (isRateLimited(ip, isApi)) {
    // Alert for API abuse (not page requests to avoid noise)
    if (isApi) {
      fetch(`${req.nextUrl.origin}/api/security/alert`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          type: 'scrape',
          page: `RATE_LIMIT_HIT: ${pathname}`,
          ua: req.headers.get('user-agent') || 'unknown',
        }),
      }).catch(() => {});
    }

    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: { 'Retry-After': '60', ...securityHeaders() },
    });
  }

  // ── 3. Block obvious scraper bots (not API routes, not static assets) ────
  const ua = req.headers.get('user-agent') || '';
  const botPatterns = /python-requests|scrapy|wget\/|go-http-client\/|libwww-perl/i;
  if (botPatterns.test(ua) && !pathname.startsWith('/api/') && !pathname.startsWith('/_next/')) {
    return new NextResponse('Forbidden', { status: 403, headers: securityHeaders() });
  }

  // ── 4. Add security headers to all responses ─────────────────────────────
  const res = NextResponse.next();
  Object.entries(securityHeaders()).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

function securityHeaders(): Record<string, string> {
  return {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), payment=(self)',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.easebuzz.in",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: http:",
      "media-src 'self' https: blob:",
      "connect-src 'self' https: wss:",
      "frame-src 'self' https://*.easebuzz.in https://pay.easebuzz.in",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://*.easebuzz.in",
    ].join('; '),
  };
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.png|robots.txt|sitemap.xml).*)',
  ],
};
