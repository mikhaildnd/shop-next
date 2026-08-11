import { PrismaPg } from '@prisma/adapter-pg';

import { categories } from '@/data/seeds/categories-mock';
import { collections } from '@/data/seeds/collections-mock';
import { products } from '@/data/seeds/products-mock';
import type { CategorySeed } from '@/data/seeds/types';
import { users } from '@/data/seeds/users-mock';
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient({
    adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL,
    }),
});

async function seedCategory(category: CategorySeed, parentId?: string) {
    const created = await prisma.category.upsert({
        where: {
            slug: category.slug,
        },

        update: {
            title: category.title,
            image: category.image ?? null,
            parentId,
        },

        create: {
            slug: category.slug,
            title: category.title,
            image: category.image ?? null,
            parentId,
        },
    });

    for (const child of category.children ?? []) {
        await seedCategory(child, created.id);
    }
}

async function seedCategories() {
    for (const category of categories) {
        await seedCategory(category);
    }

    console.log('Categories seeded');
}

async function seedCollections() {
    for (const collection of collections) {
        await prisma.collection.upsert({
            where: {
                slug: collection.slug,
            },

            update: {},

            create: collection,
        });
    }

    console.log('Collections seeded');
}

async function seedUsers() {
    for (const user of users) {
        await prisma.user.upsert({
            where: {
                email: user.email,
            },

            update: {},

            create: {
                ...user,
                isSeed: true,
            },
        });
    }

    console.log('Users seeded');
}

async function seedProducts() {
    for (const product of products) {
        await prisma.product.upsert({
            where: {
                slug: product.slug,
            },

            update: {},

            create: {
                slug: product.slug,
                title: product.title,
                description: product.description,
                ingredients: product.ingredients ?? [],
                regularPrice: product.regularPrice,
                salePrice: product.salePrice ?? null,
                ratingRate: product.ratingRate,
                ratingCount: product.ratingCount,
                stock: product.stock,
                measureType: product.measureType,
                measureValue: product.measureValue,
                isSeed: true,
                images: {
                    create: product.images.map((url, index) => ({
                        url,
                        sortOrder: index,
                    })),
                },

                category: {
                    connect: {
                        slug: product.category,
                    },
                },

                collections: {
                    create: (product.collections ?? []).map((slug) => ({
                        collection: {
                            connect: {
                                slug,
                            },
                        },
                    })),
                },
            },
        });
    }

    console.log('Products seeded');
}

async function main() {
    console.log('Start seeding...');

    await seedCategories();
    await seedCollections();

    await seedUsers();

    await seedProducts();

    console.log('Database seeded successfully');
}

main()
    .catch((error) => {
        console.error(error);

        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
