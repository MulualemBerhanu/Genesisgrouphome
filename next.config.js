/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Required for static site generation
  images: {
    unoptimized: true, // Required for static site generation
    domains: ['*'], // Allow images from any domain
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  basePath: process.env.NODE_ENV === 'production' ? '/Genesisgrouphome' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Genesisgrouphome/' : '/',
  trailingSlash: true,
}

module.exports = nextConfig 