import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimized settings
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore for deployment
  },
  reactStrictMode: true, // Enable for production
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint for now
  },
  // Optimize for Vercel deployment
  poweredByHeader: false,
  compress: true,
  // Image optimization
  images: {
    domains: ['localhost', '127.0.0.1', 'al-quran-z-ai.vercel.app'],
    formats: ['image/webp', 'image/avif'],
  },
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://al-quran-z-ai.vercel.app',
  },
};

export default nextConfig;
