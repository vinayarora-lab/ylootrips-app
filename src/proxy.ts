import { NextRequest, NextResponse } from 'next/server';

// ── Bot / Scraper User-Agent patterns ─────────────────────────────────────────
// Block aggressive AI scrapers & malicious bots. Legitimate search engines
// (Googlebot, Bingbot) are intentionally allowed.
const BLOCKED_UA_PATTERNS = [
  // AI training scrapers
  /CCBot/i,
  /Bytespider/i,
  /Amazonbot/i,
  /DataForSeoBot/i,
  /MJ12bot/i,
  /DotBot/i,
  /SemrushBot/i,          // aggressive commercial crawler
  /AhrefsBot/i,           // aggressive commercial crawler
  /MajesticBot/i,
  /BLEXBot/i,
  /serpstatbot/i,
  /PetalBot/i,
  /Sogou/i,
  /YandexBot/i,
  /Baiduspider/i,
  /360Spider/i,
  /ia_archiver/i,
  /scrapy/i,
  /python-requests/i,
  /python-httpx/i,
  /Go-http-client\/1/i,   // Go scraper (not modern services)
  /curl\//i,              // raw curl in production = likely bot
  /wget\//i,
  /libwww-perl/i,
  /Java\//i,              // raw Java HTTP client
  /axios\/0\.[0-9]\./i,   // old axios versions used by scrapers
  /HeadlessChrome/i,      // headless Chrome without real UA
  /PhantomJS/i,
  /Screaming Frog/i,
  /HTTrack/i,
  /WebCopier/i,
  /SitePoint/i,
  /harvest/i,
  /Teleport/i,
  /WebZIP/i,
  /EmailSiphon/i,
  /EmailCollector/i,
  /WebmasterWorld/i,
];

// Admin routes that require ADMIN_SECRET header
const ADMIN_ROUTES = [
  '/admin',
  '/api/admin',
];

// API routes that should never be crawled (return 404 to bots)
const PRIVATE_API_PREFIXES = [
  '/api/admin/',
  '/api/wallet/',
  '/api/payment/',
  '/api/security/',
  '/api/indexnow',
];

function isBotUA(ua: string): boolean {
  if (!ua || ua.length < 5) return true; // empty UA = bot
  return BLOCKED_UA_PATTERNS.some((p) => p.test(ua));
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some((r) => pathname.startsWith(r));
}

function isPrivateApiRoute(pathname: string): boolean {
  return PRIVATE_API_PREFIXES.some((r) => pathname.startsWith(r));
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ua = req.headers.get('user-agent') || '';
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  // ── 1. Block malicious bots from all non-API pages ─────────────────────────
  // Allow bots to hit API routes (payment callbacks etc. may come from servers)
  if (!pathname.startsWith('/api/') && isBotUA(ua)) {
    return new NextResponse('Access denied', { status: 403 });
  }

  // ── 2. Block bots from private API routes entirely ─────────────────────────
  if (isPrivateApiRoute(pathname) && isBotUA(ua)) {
    return new NextResponse('Not found', { status: 404 });
  }

  // ── 3. Protect admin UI routes (block direct browser access without token) ─
  // Admin panel is accessible only via header-based auth (set by the admin UI)
  // This prevents casual scanning from revealing admin pages exist
  if (pathname.startsWith('/admin') && !pathname.startsWith('/api/')) {
    const adminSecret = process.env.ADMIN_SECRET;
    // Admin pages are Next.js pages — we don't block them at middleware level
    // (the page itself handles auth), but we add a noindex header
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return res;
  }

  // ── 4. Block suspicious requests to sensitive API routes ──────────────────
  // If someone hits /api/admin/* from a browser (non-server call), block it
  // Exception: booking-notes uses GCS service-account auth — no ADMIN_SECRET needed
  if (pathname.startsWith('/api/admin/') &&
      !pathname.startsWith('/api/admin/booking-notes') &&
      !pathname.startsWith('/api/admin/booking-docs')) {
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      // ADMIN_SECRET not configured — deny all admin API access
      return NextResponse.json({ error: 'Not configured' }, { status: 503 });
    }
    const token =
      req.headers.get('x-admin-secret') ||
      req.headers.get('x-admin-token') ||
      req.headers.get('authorization')?.replace('Bearer ', '');
    if (token !== adminSecret) {
      // Log suspicious access attempt
      console.warn(`[middleware] Unauthorized admin access: ${pathname} from ${ip} UA:${ua.slice(0, 80)}`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // ── 5. Security headers on all responses ──────────────────────────────────
  const res = NextResponse.next();

  // Prevent clickjacking even on API responses
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');

  // Tell Cloudflare / CDN not to cache admin/payment API responses
  if (pathname.startsWith('/api/admin/') || pathname.startsWith('/api/payment/') || pathname.startsWith('/api/wallet/')) {
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.headers.set('Pragma', 'no-cache');
  }

  return res;
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: [
    '/((?!_next/static|_next/image|favicon|logo|robots|sitemap|llms|BingSiteAuth|apple-touch|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|woff2?|ttf|otf|mp3|mp4|css|js|map)).*)',
  ],
};
