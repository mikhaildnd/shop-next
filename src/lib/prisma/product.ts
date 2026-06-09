import type { Prisma } from '@/generated/prisma/client';

export const productInclude = {
    images: true,
    category: true,
    collections: {
        include: {
            collection: true,
        },
    },
} satisfies Prisma.ProductInclude;

export type ProductWithRelations = Prisma.ProductGetPayload<{
    include: typeof productInclude;
}>;
