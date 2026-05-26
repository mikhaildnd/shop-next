import { cache } from 'react';
import { prisma } from '@/lib/db';
import type { Category } from '@/generated/prisma/client';

export const getCategoryBySlug = cache(
    async (slug: string): Promise<Category | null> => {
        return prisma.category.findUnique({
            where: { slug },
        });
    },
);
