import { cache } from 'react';
import { prisma } from '@/lib/db';
import type { CategoryDto } from '@/services/category/category.types';
import { Prisma } from '@/generated/prisma/client';

const categorySelect = {
    id: true,
    slug: true,
    title: true,
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
