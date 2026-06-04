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
};

export default nextConfig;
