import type { CategorySeed } from '@/data/seeds/types';

const categories: CategorySeed[] = [
    {
        slug: 'dairy',
        title: 'Молочные продукты',
        children: [
            {
                slug: 'milk',
                title: 'Молоко, сливки, сгущённое молоко',
            },
            {
                slug: 'cheese',
                title: 'Сыр',
            },
            {
                slug: 'curd',
                title: 'Кефир, творог, сметана',
            },
            {
                slug: 'yogurt-desserts',
                title: 'Йогурты, сырки, десерты',
            },
            {
                slug: 'eggs-butter',
                title: 'Яйца, масло, маргарин',
            },
        ],
    },

    {
        slug: 'drinks',
        title: 'Напитки',
        children: [
            {
                slug: 'water',
                title: 'Вода',
            },
            {
                slug: 'juice',
                title: 'Соки и нектары',
            },
            {
                slug: 'carbonated-drinks',
                title: 'Газированные напитки',
            },
            {
                slug: 'tea-mors-compote',
                title: 'Холодный чай, морс, компот',
            },
            {
                slug: 'non-alcoholic-beverages',
                title: 'Безалкогольные напитки',
            },
        ],
    },

    {
        slug: 'frozen-food',
        title: 'Замороженные продукты',
        children: [
            {
                slug: 'ice-cream',
                title: 'Мороженое',
            },
            {
                slug: 'semi-finished-products',
                title: 'Полуфабрикаты',
            },
            {
                slug: 'dumplings',
                title: 'Пельмени',
            },
            {
                slug: 'vareniki',
                title: 'Вареники',
            },
            {
                slug: 'frozen-bakery',
                title: 'Хлеб, выпечка, пироги и тесто',
            },
            {
                slug: 'frozen-fruits-vegetables',
                title: 'Замороженные овощи и фрукты',
            },
        ],
    },

    {
        slug: 'fruits-vegetables',
        title: 'Овощи, фрукты и зелень',
        children: [
            {
                slug: 'vegetables',
                title: 'Овощи',
            },
            {
                slug: 'fruits',
                title: 'Фрукты',
            },
            {
                slug: 'greens',
                title: 'Зелень',
            },
            {
                slug: 'mushrooms',
                title: 'Грибы',
            },
            {
                slug: 'berries',
                title: 'Ягоды',
            },
            {
                slug: 'pickles',
                title: 'Соленья и квашеные продукты',
            },
        ],
    },

    {
        slug: 'ready-meals',
        title: 'Готовая еда',
        children: [
            {
                slug: 'salads',
                title: 'Салаты',
            },
            {
                slug: 'sandwiches-bakery',
                title: 'Сэндвичи и выпечка',
            },
            {
                slug: 'soups',
                title: 'Супы',
            },
            {
                slug: 'main-dishes',
                title: 'Вторые блюда',
            },
            {
                slug: 'desserts',
                title: 'Десерты',
            },
            {
                slug: 'breakfasts',
                title: 'Завтраки',
            },
        ],
    },
];

export default categories;
