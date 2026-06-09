import type { Prisma } from '@/generated/prisma/client';

type CollectionSeed = Prisma.CollectionCreateInput;

const collections: CollectionSeed[] = [
    {
        slug: 'promotion',
        title: 'Акции',
    },
    {
        slug: 'new',
        title: 'Новинки',
    },
];

export default collections;
