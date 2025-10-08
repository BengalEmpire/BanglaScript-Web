import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',             // Applies to all crawlers
        allow: '/',                 // Allow all public pages
        disallow: [
          '/admin/',
          '/api/',
          '/private/',
          '/_next/',                // Internal Next.js assets
          '/server-sitemap-index.xml', // Optional: dynamic sitemaps
        ],
      },
    ],
    sitemap: 'https://yourdomain.com/sitemap.xml',
    host: 'https://bangla-script.vercel.app',
  }
}
