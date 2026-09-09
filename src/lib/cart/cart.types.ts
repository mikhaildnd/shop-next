export type CartProductSnapshot = {
    effectivePrice: number;
};

export type CartEntry = {
    productId: string;
    quantity: number;
    snapshot: CartProductSnapshot;
};

export type MergeStatus = 'idle' | 'merging' | 'error';
