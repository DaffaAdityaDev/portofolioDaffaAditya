import { getSortedPostsData } from '@/lib/posts';
import { NextApiRequest, NextApiResponse } from 'next';

const generateSitemap = (posts: any[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- Static pages -->
      <url>
        <loc>https://daffaaditya.id</loc>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
      </url>
      <url>
        <loc>https://daffaaditya.id/blog</loc>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
      </url>
      
      <!-- Dynamic blog posts -->
      ${posts
        .filter(post => post.production !== false)
        .map(({ id, date }) => {
          return `
            <url>
              <loc>https://daffaaditya.id/blog/post/${id}</loc>
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
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.write(sitemap);
    res.end();
  } catch (error) {
    res.status(500).json({ error: 'Error generating sitemap' });
  }
}
