import type { Prisma } from '@/generated/prisma/client';

export type ProductWithRelations = Prisma.ProductGetPayload<{
    include: {
        images: true;
        categories: {
            include: {
                category: true;
            };
        };
    };
}>;
