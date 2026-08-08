import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/checkout/',
          '/payment/',
          '/events/checkout',
          '/events/*/tickets',
          '/my-booking',
          '/my-trips',
          '/payment-demo',
          '/stories/write',
          '/flights/book',
          '/flights/booking-success',
          '/hotels/booking-success',
          '/market/booking-success',
          '/market/booking-failure',
          '/vouchers/pdf',
          '/profile',
          '/*?*',
        ],
      },
      // ── AI search bots — allow for AEO (appear in AI Overviews, Perplexity, Gemini) ──
      { userAgent: 'GPTBot',            allow: ['/'] },
      { userAgent: 'OAI-SearchBot',     allow: ['/'] },
      { userAgent: 'Google-Extended',   allow: ['/'] },
      { userAgent: 'PerplexityBot',     allow: ['/'] },
      { userAgent: 'anthropic-ai',      allow: ['/'] },
      { userAgent: 'ClaudeBot',         allow: ['/'] },
      { userAgent: 'YouBot',            allow: ['/'] },
      { userAgent: 'cohere-ai',         allow: ['/'] },
      { userAgent: 'meta-externalagent',allow: ['/'] },
      { userAgent: 'Applebot-Extended', allow: ['/'] },
      { userAgent: 'DuckDuckBot',       allow: ['/'] },
      { userAgent: 'Amazonbot',         allow: ['/'] },
      { userAgent: 'facebookexternalhit', allow: ['/'] },
      { userAgent: 'Twitterbot',        allow: ['/'] },
      { userAgent: 'xAI-SearchBot',     allow: ['/'] },
      { userAgent: 'MistralBot',        allow: ['/'] },
      { userAgent: 'NaverBot',          allow: ['/'] },
      { userAgent: 'BingBot',           allow: ['/'] },
      // ── Block pure training scrapers ──────────────────────────────────
      { userAgent: 'CCBot',             disallow: ['/'] },
      { userAgent: 'Bytespider',        disallow: ['/'] },
    ],
    sitemap: 'https://www.ylootrips.com/sitemap.xml',
    host: 'https://www.ylootrips.com',
  };
}
