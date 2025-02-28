/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Required for static site generation
  images: {
    unoptimized: true, // Required for static site generation
    loader: 'custom',
    loaderFile: './src/utils/imageLoader.js',
  },
  trailingSlash: true,
}

module.exports = nextConfig 