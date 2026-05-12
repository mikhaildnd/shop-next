import { ObjectId } from 'mongodb';

type UserPurchases = {
    productId: ObjectId;
    date: string;
};

interface UserBase {
    name: string;
    email: string;
    phone: string;
    purchases: UserPurchases[];
}

export type UserDto = UserBase & { _id: string };

export type UserDocument = UserBase & { _id: ObjectId };
