'use client';

import dynamic from 'next/dynamic';

import { MapsSkeleton } from '@/components/maps/MapsSkeleton';

export const MapsLazy = dynamic(
    () =>
        import('@/components/maps/Maps').then((module) => ({
            default: module.Maps,
        })),
    {
        loading: () => <MapsSkeleton />,
        ssr: false,
    },
);
