import { cache } from 'react';

import { prisma } from '@/lib/db';
import type { CollectionDto } from '@/services/collection/collection.types';

export const getCollectionBySlug = cache(
    async (slug: string): Promise<CollectionDto | null> => {
        return prisma.collection.findUnique({
            where: { slug },
        });
    },
);
