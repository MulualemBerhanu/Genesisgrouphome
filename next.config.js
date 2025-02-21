/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Required for static site generation
  images: {
    unoptimized: true, // Required for static site generation
  },
  basePath: '/Genesisgrouphome', // Replace with your repository name
  assetPrefix: '/Genesisgrouphome/', // Replace with your repository name
}

module.exports = nextConfig 