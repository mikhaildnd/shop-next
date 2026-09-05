export class CartStockError extends Error {
    constructor() {
        super('Cart item quantity exceeds available stock');
        this.name = 'CartStockError';
    }
}
