import type { CategorySeed } from '@/data/seeds/types';

export const categories: CategorySeed[] = [
    {
        slug: 'dairy',
        title: 'Молочные продукты',
        children: [
            {
                slug: 'milk',
                title: 'Молоко, сливки, сгущённое молоко',
                image: '/images/categories/dairy/category-moloko-smetana-maslo.webp',
            },
            {
                slug: 'cheese',
                title: 'Сыр',
                image: '/images/categories/dairy/category-syr.webp',
            },
            {
                slug: 'curd',
                title: 'Кефир, творог, сметана',
                image: '/images/categories/dairy/category-kefir-tvorog-smetana.webp',
            },
            {
                slug: 'yogurt-desserts',
                title: 'Йогурты, сырки, десерты',
                image: '/images/categories/dairy/category-iogurty-syrki-deserty.webp',
            },
            {
                slug: 'eggs-butter',
                title: 'Яйца, масло, маргарин',
                image: '/images/categories/dairy/category-yaica.webp',
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
                image: '/images/categories/drinks/category-voda.webp',
            },
            {
                slug: 'juice',
                title: 'Соки и нектары',
                image: '/images/categories/drinks/category-soki-nektary.webp',
            },
            {
                slug: 'carbonated-drinks',
                title: 'Газированные напитки',
                image: '/images/categories/drinks/category-gazirovka-i-energetiki.webp',
            },
            {
                slug: 'tea-mors-compote',
                title: 'Холодный чай, морс, компот',
                image: '/images/categories/drinks/category-holodnyi-chai-kompot-mors.webp',
            },
            {
                slug: 'non-alcoholic-beverages',
                title: 'Безалкогольные напитки',
                image: '/images/categories/drinks/category-bezalkogolnye-napitki.webp',
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
                image: '/images/categories/frozen-food/category-morozhenoe.webp',
            },
            {
                slug: 'semi-finished-products',
                title: 'Полуфабрикаты',
                image: '/images/categories/frozen-food/category-pelmeni-vareniki-manty.webp',

                children: [
                    {
                        slug: 'dumplings',
                        title: 'Пельмени',
                    },
                    {
                        slug: 'vareniki',
                        title: 'Вареники',
                    },
                ],
            },
            {
                slug: 'frozen-bakery',
                title: 'Хлеб, выпечка, пироги и тесто',
                image: '/images/categories/frozen-food/category-blinchiki-kruassany-syrniki.webp',
            },
            {
                slug: 'frozen-fruits-vegetables',
                title: 'Замороженные овощи и фрукты',
                image: '/images/categories/frozen-food/category-frukty-i-ovoshi-zamorozhennye.webp',
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
                image: '/images/categories/fruits-vegetables/category-ovoshi.webp',
            },
            {
                slug: 'fruits',
                title: 'Фрукты',
                image: '/images/categories/fruits-vegetables/category-frukty.webp',
            },
            {
                slug: 'greens',
                title: 'Зелень',
                image: '/images/categories/fruits-vegetables/category-zelen.webp',
            },
            {
                slug: 'mushrooms',
                title: 'Грибы',
                image: '/images/categories/fruits-vegetables/category-griby.webp',
            },
            {
                slug: 'berries',
                title: 'Ягоды',
                image: '/images/categories/fruits-vegetables/category-yagody.webp',
            },
            {
                slug: 'pickles',
                title: 'Соленья и квашеные продукты',
                image: '/images/categories/fruits-vegetables/category-solenya.webp',
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
                image: '/images/categories/ready-meals/category-sendvichi-i-kruassany.webp',
            },
            {
                slug: 'soups',
                title: 'Супы',
                image: '/images/categories/ready-meals/category-supy.webp',
            },
            {
                slug: 'main-dishes',
                title: 'Вторые блюда',
                image: '/images/categories/ready-meals/category-vtorye-blyuda.webp',
            },
            {
                slug: 'desserts',
                title: 'Десерты',
                image: '/images/categories/ready-meals/category-torty-pirozhnye-vypechka.webp',
            },
            {
                slug: 'breakfasts',
                title: 'Завтраки',
                image: '/images/categories/ready-meals/category-zavtraki.webp',
            },
        ],
    },
];
