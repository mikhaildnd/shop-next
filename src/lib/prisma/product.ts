import type { Prisma } from '@/generated/prisma/client';

export const productInclude = {
    images: true,
    categories: {
        include: {
            category: true,
        },
    },
} satisfies Prisma.ProductInclude;

export type ProductWithRelations = Prisma.ProductGetPayload<{
    include: typeof productInclude;
}>;
