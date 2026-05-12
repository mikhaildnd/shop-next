const users = require('../src/data/seeds/users');

module.exports = {
    async up(db) {
        const products = await db.collection('products').find({}).toArray();

        const productMap = new Map();

        products.forEach((product) => {
            productMap.set(product.slug, product._id);
        });

        const seedUsers = users.map((user) => ({
            name: user.name,
            email: user.email,
            phone: user.phone,
            isSeed: true,
            purchases: user.purchases.map((purchase) => {
                const productId = productMap.get(purchase.productSlug);

                if (!productId) {
                    throw new Error(
                        `Product with slug "${purchase.productSlug}" not found`,
                    );
                }

                return {
                    productId,
                    date: purchase.date,
                };
            }),
        }));

        await db.collection('users').insertMany(seedUsers);

        await db
            .collection('users')
            .createIndex({ email: 1 }, { unique: true });
    },

    async down(db) {
        try {
            await db.collection('users').dropIndex('email_1');
        } catch {}

        await db.collection('users').deleteMany({
            isSeed: true,
        });
    },
};
