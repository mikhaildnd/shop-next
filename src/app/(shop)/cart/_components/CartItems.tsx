import { CartItem } from '@/app/(shop)/cart/_components/CartItem';
import type { CartEntry } from '@/lib/cart/cart.types';
import { cn } from '@/lib/cn';
import type { CartProductLookup } from '@/services/cart/cart.types';

interface CartItemsProps {
    entries: CartEntry[];
    products: CartProductLookup[];
    className?: string;
}

export function CartItems({ entries, products, className }: CartItemsProps) {
    const productsById = new Map(
        products.map((product) => [product.productId, product]),
    );

    const availableEntries = entries.filter((entry) => {
        const product = productsById.get(entry.productId);
        return !product || product.stock > 0;
    });

    const unavailableEntries = entries.filter((entry) => {
        const product = productsById.get(entry.productId);
        return product?.stock === 0;
    });

    return (
        <div className={cn('flex flex-col gap-6', className)}>
            <div className="flex flex-col divide-y divide-gray-200">
                {availableEntries.map((entry) => (
                    <CartItem
                        key={entry.productId}
                        entry={entry}
                        product={productsById.get(entry.productId)}
                    />
                ))}
            </div>

            {unavailableEntries.length > 0 && (
                <div className="flex flex-col">
                    <p className="text-md mb-2 font-semibold">
                        Недоступны для заказа
                    </p>

                    <div className="flex flex-col divide-y divide-gray-200">
                        {unavailableEntries.map((entry) => (
                            <CartItem
                                key={entry.productId}
                                entry={entry}
                                product={productsById.get(entry.productId)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
