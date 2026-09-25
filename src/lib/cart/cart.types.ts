export type CartProduct = {
    productId: string;
    title: string;
    slug: string;
    stock: number;
    regularPrice: number;
    effectivePrice: number;
    discountPercent: number;
};

export type CartItemSnapshot = {
    title: string;
    imageUrl: string | null;
    effectivePrice: number;
};

export type CartEntry = {
    productId: string;
    quantity: number;
    snapshot: CartItemSnapshot;
};

export type CartItemData = CartEntry & {
    product: CartProduct | null;
};

export type MergeStatus = 'idle' | 'merging' | 'error';
