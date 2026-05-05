/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  compiler: {
    // Remove console logs in production for better performance and cleaner logs
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimize package imports for faster builds and smaller bundles
  optimizePackageImports: ['lucide-react', 'framer-motion', '@heroui/react'],
};

module.exports = nextConfig;
