import { prisma } from '@/lib/db';
import users from '@/data/seeds/users-mock';
import products from '@/data/seeds/products-mock';
import categories from '@/data/seeds/categories-mock';

async function seedCategories() {
    for (const category of categories) {
        await prisma.category.upsert({
            where: {
                slug: category.slug,
            },

            update: {},

            create: category,
        });
    }

    console.log('Categories seeded');
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
                basePrice: product.basePrice,
                discountPercent: product.discountPercent ?? 0,
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

                categories: {
                    create: product.categories.map((slug) => ({
                        category: {
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
