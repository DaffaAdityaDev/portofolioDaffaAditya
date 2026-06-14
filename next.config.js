/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  compiler: {
    // Remove console logs in production for better performance and cleaner logs
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@heroui/react'],
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
