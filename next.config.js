// Public static folders. Filenames are not content-hashed, so cache for a week
// (not `immutable`) and let browsers revalidate in the background after that.
const STATIC_ASSET_DIRS = ['image', 'svg', 'assets'];
const STATIC_ASSET_FILES = ['/favicon.ico'];
const STATIC_ASSET_CACHE_CONTROL = 'public, max-age=604800, stale-while-revalidate=86400';

// The live editor's preview (/playground-runtime) runs in a sandboxed iframe with an
// opaque origin, so to it this site's scripts are cross-origin. Without CORS the browser
// hides the details of every error they run ("Script error.") and drops unhandled
// rejections. Loading them with crossorigin, and allowing it, keeps those errors readable.
const SCRIPT_CORS_HEADERS = [{ key: 'Access-Control-Allow-Origin', value: '*' }];

// Old per-project case-study URLs, now grouped by engagement (features/Projects/engagements.ts).
// An old slug must never be reused as an engagement slug: redirects run before pages.
const CASE_STUDY_REDIRECTS = {
  'platform': 'run-system',
  'accounting-plus': 'run-system',
  'ombudsman-item-management': 'ombudsman-ri',
  'qqtech-website': 'qqtech',
};

// Renamed blog post ids (old id -> new id), so shared links keep working.
const BLOG_POST_REDIRECTS = {
  'solid-5-pirinciples-that-can-improve-you-codebase': 'solid-5-principles-that-can-improve-your-codebase',
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  poweredByHeader: false,
  compress: true,
  crossOrigin: 'anonymous',
  compiler: {
    // Remove console logs in production for better performance and cleaner logs
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'zustand', 'prismjs'],
  },
  // Lets a verification build write to its own folder without clobbering the dev server's .next.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [128, 256, 384],
    minimumCacheTTL: 2592000,
  },
  async redirects() {
    return [
      ...Object.entries(CASE_STUDY_REDIRECTS).map(([from, to]) => ({
        source: `/case-studies/${from}`,
        destination: `/case-studies/${to}`,
        permanent: true,
      })),
      ...Object.entries(BLOG_POST_REDIRECTS).map(([from, to]) => ({
        source: `/blog/post/${from}`,
        destination: `/blog/post/${to}`,
        permanent: true,
      })),
    ];
  },
  async headers() {
    return [
      ...STATIC_ASSET_DIRS.map((dir) => ({
        source: `/${dir}/:path*`,
        headers: [{ key: 'Cache-Control', value: STATIC_ASSET_CACHE_CONTROL }],
      })),
      ...STATIC_ASSET_FILES.map((source) => ({
        source,
        headers: [{ key: 'Cache-Control', value: STATIC_ASSET_CACHE_CONTROL }],
      })),
      { source: '/_next/:path*', headers: SCRIPT_CORS_HEADERS },
    ];
  },
};

module.exports = nextConfig;
