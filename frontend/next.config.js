/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        turbopack: true,
    },
    domains: ['via.placeholder.com', 'thumbnail.image.rakuten.co.jp'],
    images: {
        domains: ['via.placeholder.com', 'thumbnail.image.rakuten.co.jp'],
        deviceSizes: [320, 640, 960, 1280, 1920],
        imageSizes: [16, 32, 48, 64, 96],
    },
    alias: {
        '@': './src',
    },
};
module.exports = nextConfig;