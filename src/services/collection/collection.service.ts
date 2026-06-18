import { cache } from 'react';
import { prisma } from '@/lib/db';
import type { Collection } from '@/generated/prisma/client';

export const getCollectionBySlug = cache(
    async (slug: string): Promise<Collection | null> => {
        return prisma.collection.findUnique({
            where: { slug },
        });
    },
);
