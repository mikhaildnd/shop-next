'use client';

import dynamic from 'next/dynamic';
import MapsSkeleton from '@/components/maps/MapsSkeleton';

const MapsLazy = dynamic(() => import('@/components/maps/Maps'), {
    loading: () => <MapsSkeleton />,
    ssr: false,
});

export default MapsLazy;
