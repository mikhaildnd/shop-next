const products = require('../src/data/seeds/products');

module.exports = {
    async up(db) {
        const seedProducts = products.map((product) => ({
            ...product,
            isSeed: true,
        }));

        await db.collection('products').insertMany(seedProducts);

        await db
            .collection('products')
            .createIndex({ slug: 1 }, { unique: true });
    },

    async down(db) {
        try {
            await db.collection('products').dropIndex('slug_1');
        } catch {}

        await db.collection('products').deleteMany({
            isSeed: true,
        });
    },
};
