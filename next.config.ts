import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        qualities: [70, 75, 80],
    },
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
    },
    allowedDevOrigins: ['192.168.0.132'],
};

export default nextConfig;
