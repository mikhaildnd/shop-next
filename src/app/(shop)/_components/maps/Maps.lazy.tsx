'use client';

import dynamic from 'next/dynamic';

import { MapsSkeleton } from '@/app/(shop)/_components/maps/MapsSkeleton';

export const MapsLazy = dynamic(
    () =>
        import('@/app/(shop)/_components/maps/Maps').then((module) => ({
            default: module.Maps,
        })),
    {
        loading: () => <MapsSkeleton />,
        ssr: false,
    },
);
