/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        turbopack: true,
    },
    images: {
        domains: ['via.placeholder.com', 'thumbnail.image.rakuten.co.jp'],
    },
    alias: {
        '@': './src',
    },
};
module.exports = nextConfig;