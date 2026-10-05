'use client';

import { ChevronUpIcon } from 'lucide-react';

import { SummaryDetails } from '@/app/(shop)/cart/_components/SummaryDetails';
import { Button } from '@/components/button/Button';
import { useCartContext } from '@/components/cart/CartContext';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { cn } from '@/lib/cn';
import { formatPrice } from '@/lib/format-price';

interface CartSummaryMobileProps {
    className?: string;
}

export function CartSummaryMobile({ className }: CartSummaryMobileProps) {
    const { direction } = useScrollDirection();
    const isNavigationHidden = direction === 'down';

    const { cartSummary, isQuantityUpdating } = useCartContext();

    const isCheckoutDisabled =
        cartSummary.isCheckoutDisabled || isQuantityUpdating;

    return (
        <div className={className}>
            <Drawer
                swipeDirection="down"
                showSwipeHandle
            >
                <div
                    className={cn(
                        'fixed inset-x-0 bottom-(--bottom-nav-height) z-40 flex items-center gap-4 border-b border-gray-200 bg-white px-3 py-2 shadow-(--shadow-top)',
                        'transition-transform duration-(--transition-duration-default)',
                        isNavigationHidden &&
                            'translate-y-(--bottom-nav-height)',
                    )}
                >
                    <DrawerTrigger className="flex min-w-0 flex-1 items-center gap-2 text-left">
                        <div className="flex min-w-0 flex-col">
                            <span className="text-sm text-gray-500">Итого</span>

                            <span className="font-semibold text-[#414141]">
                                {formatPrice(cartSummary.effectivePriceTotal)} ₸
                            </span>
                        </div>

                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-100">
                            <ChevronUpIcon className="size-4 text-gray-500" />
                        </span>
                    </DrawerTrigger>

                    <Button disabled={isCheckoutDisabled}>К оформлению</Button>
                </div>

                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Детали заказа</DrawerTitle>
                    </DrawerHeader>

                    <div className="flex flex-col gap-8 p-4">
                        <SummaryDetails />

                        <Button
                            disabled={
                                cartSummary.isCheckoutDisabled ||
                                isQuantityUpdating
                            }
                        >
                            Перейти к оформлению
                        </Button>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
