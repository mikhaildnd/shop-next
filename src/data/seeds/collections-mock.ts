import type { Prisma } from '@/generated/prisma/client';

type CollectionSeed = Prisma.CollectionCreateInput;

export const collections: CollectionSeed[] = [
    {
        slug: 'promotion',
        title: 'Акции',
    },
    {
        slug: 'new',
        title: 'Новинки',
    },
];
