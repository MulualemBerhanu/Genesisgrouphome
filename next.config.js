/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Required for static site generation
  images: {
    unoptimized: true, // Required for static site generation
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  basePath: '/Genesisgrouphome', // Replace with your repository name
  assetPrefix: '/Genesisgrouphome/', // Replace with your repository name
  trailingSlash: true,
}

module.exports = nextConfig 