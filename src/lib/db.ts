import { MongoClient } from 'mongodb';

const url = process.env.NEXT_SHOP_DB_URL;
const dbName = process.env.NEXT_SHOP_DB_NAME;

if (!url) {
    throw new Error('NEXT_SHOP_DB_URL is not defined');
}

if (!dbName) {
    throw new Error('NEXT_SHOP_DB_NAME is not defined');
}

const client = new MongoClient(url);

const clientPromise = client.connect();

export const getDb = async () => {
    return (await clientPromise).db(dbName);
};
