import type { Prisma } from '@/generated/prisma/client';

type CategorySeed = Prisma.CategoryCreateInput;

const categories: CategorySeed[] = [
    {
        slug: 'dairy',
        title: 'Молочные продукты',
    },
    {
        slug: 'drinks',
        title: 'Напитки',
    },
    {
        slug: 'promotion',
        title: 'Акции',
    },
    {
        slug: 'new',
        title: 'Новинки',
    },
    {
        slug: 'frozen',
        title: 'Замороженные продукты',
    },
    {
        slug: 'vegetables',
        title: 'Овощи',
    },
    {
        slug: 'cooked-food',
        title: 'Готовая еда',
    },
];

export default categories;
