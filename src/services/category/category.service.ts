import { cache } from 'react';

import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/db';
import type { CategoryDto } from '@/services/category/category.types';

const categorySelect = {
    id: true,
    slug: true,
    title: true,
    image: true,
    parentId: true,
} satisfies Prisma.CategorySelect;

export const getCategoryBySlug = cache(
    async (slug: string): Promise<CategoryDto | null> => {
        return prisma.category.findUnique({
            where: { slug },
            select: categorySelect,
        });
    },
);

export const getCategories = cache(async (): Promise<CategoryDto[]> => {
    return prisma.category.findMany({
        select: categorySelect,
    });
});

export const findCategories = async (
    query: string,
    take: number,
): Promise<CategoryDto[]> => {
    const normalizedQuery = query.trim();

    return prisma.category.findMany({
        where: {
            title: {
                contains: normalizedQuery,
                mode: 'insensitive',
            },
        },
        select: categorySelect,
        take,
    });
};
