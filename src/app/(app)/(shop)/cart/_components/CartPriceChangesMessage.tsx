import { TriangleAlert } from 'lucide-react';

import { CartPriceChangesDialog } from '@/app/(app)/(shop)/cart/_components/CartPriceChangesDialog';
import { Button } from '@/components/button/Button';
import { CloseButton } from '@/components/button/CloseButton';
import type { CartItemData } from '@/lib/cart/cart.types';
import { cn } from '@/lib/cn';

interface CartPriceChangesMessageProps {
    onConfirm: () => void;
    onClose: () => void;
    cartItems: CartItemData[];
    className?: string;
}

export function CartPriceChangesMessage({
    onConfirm,
    onClose,
    cartItems,
    className,
}: CartPriceChangesMessageProps) {
    return (
        <div
            className={cn(
                'flex justify-between gap-2 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-2 sm:items-center sm:px-4 sm:py-3',
                className,
            )}
        >
            <div className="flex grow gap-1.5">
                <TriangleAlert className="size-4 shrink-0 translate-y-0.5 text-amber-700 sm:translate-y-1" />

                <div className="flex flex-col items-start gap-y-3 sm:w-full sm:flex-row sm:items-center sm:justify-between sm:gap-x-3">
                    <div className="flex flex-col">
                        <h3 className="text-sm font-semibold text-amber-700 sm:text-base">
                            Цена некоторых товаров изменилась
                        </h3>
                        <p className="text-xs text-gray-600 sm:text-sm">
                            Проверьте цены перед оформлением заказа.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <CartPriceChangesDialog cartItems={cartItems} />

                        <Button
                            size="sm"
                            variant="primary"
                            onClick={onConfirm}
                        >
                            Подтвердить
                        </Button>
                    </div>
                </div>
            </div>

            <CloseButton
                onClick={onClose}
                variant="ghost"
                size="sm"
                aria-label="Закрыть сообщение"
            />
        </div>
    );
}
