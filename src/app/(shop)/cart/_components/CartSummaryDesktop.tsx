'use client';

import { SummaryDetails } from '@/app/(shop)/cart/_components/SummaryDetails';
import { Button } from '@/components/button/Button';
import { useCartContext } from '@/components/cart/CartContext';
import { cn } from '@/lib/cn';

interface CartSummaryDesktopProps {
    className?: string;
}

export function CartSummaryDesktop({ className }: CartSummaryDesktopProps) {
    const { cartSummary, isQuantityUpdating } = useCartContext();

    const isCheckoutDisabled =
        cartSummary.isCheckoutDisabled || isQuantityUpdating;

    return (
        <div
            className={cn(
                'flex flex-col gap-8 rounded-md border border-gray-100 bg-white px-4 py-4 text-[#414141]',
                'sticky top-22',
                className,
            )}
        >
            <SummaryDetails />

            <Button disabled={isCheckoutDisabled}>Перейти к оформлению</Button>
        </div>
    );
}
