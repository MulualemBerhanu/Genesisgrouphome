/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/Genesisgrouphome',
  assetPrefix: '/Genesisgrouphome/',
  trailingSlash: true,
}

module.exports = nextConfig 