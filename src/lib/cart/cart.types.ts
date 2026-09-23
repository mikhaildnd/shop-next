export type CartProductSnapshot = {
    title: string;
    imageUrl: string | null;
    effectivePrice: number;
};

export type CartEntry = {
    productId: string;
    quantity: number;
    snapshot: CartProductSnapshot;
};

export type CartItemData = CartEntry & {
    product: {
        productId: string;
        title: string;
        slug: string;
        stock: number;
        regularPrice: number;
        effectivePrice: number;
        discountPercent: number;
    } | null;
};

export type MergeStatus = 'idle' | 'merging' | 'error';
