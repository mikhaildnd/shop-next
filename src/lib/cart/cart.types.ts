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

export type CartItemData = {
    productId: string;
    quantity: number;
    quantityAdjustedFrom: number | null;
    snapshot: CartItemSnapshot;
    product: CartProduct | null;
};
