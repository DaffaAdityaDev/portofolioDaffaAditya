import { getSortedPostsData } from '@/lib/posts';
import type { PostData } from '@/types/blog';
import { ENGAGEMENTS } from '@/features/Projects/engagements';
import { siteConfig } from '@/config/metadata.config';
import { NextApiRequest, NextApiResponse } from 'next';

// Lists pages by hand. Internal pages such as /playground-runtime (the blog editor's
// preview iframe, marked noindex) stay out on purpose.
const STATIC_PAGES = ['/case-studies', '/freelance', '/resume'];

const generateSitemap = (posts: PostData[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- Static pages -->
      <url>
        <loc>${siteConfig.url}</loc>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
      </url>
      <url>
        <loc>${siteConfig.url}/blog</loc>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
      </url>
      ${STATIC_PAGES.map((path) => `
      <url>
        <loc>${siteConfig.url}${path}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
      </url>`).join('')}

      <!-- Case studies, one per engagement -->
      ${ENGAGEMENTS
        .map(({ slug }) => `
      <url>
        <loc>${siteConfig.url}/case-studies/${slug}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
      </url>`)
        .join('')}
      
      <!-- Dynamic blog posts -->
      ${posts
        .filter(post => post.production !== false)
        .map(({ id, date }) => {
          return `
            <url>
              <loc>${siteConfig.url}/blog/post/${id}</loc>
              <lastmod>${new Date(date).toISOString()}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>0.5</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>`;
};

// Convert to API route for dynamic sitemap generation
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const posts = getSortedPostsData();
    const sitemap = generateSitemap(posts);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
    res.write(sitemap);
    res.end();
  } catch {
    res.status(500).json({ error: 'Error generating sitemap' });
  }
}
