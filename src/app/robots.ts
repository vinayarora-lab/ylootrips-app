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
                ],
            },
            {
                // Block AI training bots
                userAgent: 'GPTBot',
                disallow: ['/'],
            },
            {
                userAgent: 'Google-Extended',
                disallow: ['/'],
            },
            {
                userAgent: 'CCBot',
                disallow: ['/'],
            },
        ],
        sitemap: 'https://www.ylootrips.com/sitemap.xml',
        host: 'https://www.ylootrips.com',
    };
}
