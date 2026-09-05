'use client';

import { ChevronUpIcon } from 'lucide-react';

import { Button } from '@/components/button/Button';
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

interface CartSummaryProps {
    cartCount: number;
    regularPriceTotal: number;
    discountAmount: number;
    effectivePriceTotal: number;
}

interface SummaryDetailsProps {
    cartCount: number;
    regularPriceTotal: number;
    discountAmount: number;
    effectivePriceTotal: number;
}

export function CartSummary({
    cartCount,
    regularPriceTotal,
    discountAmount,
    effectivePriceTotal,
}: CartSummaryProps) {
    const { direction } = useScrollDirection();
    const isNavigationHidden = direction === 'down';

    return (
        <>
            <div className="hidden rounded-md border border-gray-100 bg-white px-4 py-4 text-[#414141] lg:sticky lg:top-22 lg:flex lg:flex-col lg:gap-8">
                <SummaryDetails
                    cartCount={cartCount}
                    regularPriceTotal={regularPriceTotal}
                    discountAmount={discountAmount}
                    effectivePriceTotal={effectivePriceTotal}
                />

                <Button>Перейти к оформлению</Button>
            </div>

            <div className="lg:hidden">
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
                                <span className="text-sm text-gray-500">
                                    Итого
                                </span>
                                <span className="font-semibold text-[#414141]">
                                    {formatPrice(effectivePriceTotal)} ₸
                                </span>
                            </div>

                            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-100">
                                <ChevronUpIcon className="size-4 text-gray-500" />
                            </span>
                        </DrawerTrigger>

                        <Button>К оформлению</Button>
                    </div>

                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Детали заказа</DrawerTitle>
                        </DrawerHeader>

                        <div className="flex flex-col gap-8 p-4">
                            <SummaryDetails
                                cartCount={cartCount}
                                regularPriceTotal={regularPriceTotal}
                                discountAmount={discountAmount}
                                effectivePriceTotal={effectivePriceTotal}
                            />

                            <Button>Перейти к оформлению</Button>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </>
    );
}

function SummaryDetails({
    cartCount,
    regularPriceTotal,
    discountAmount,
    effectivePriceTotal,
}: SummaryDetailsProps) {
    return (
        <div className="flex flex-col gap-2 text-[#414141]">
            <h3 className="text-xl font-semibold">Ваша корзина</h3>

            <div className="flex justify-between">
                <span>Количество товаров</span>
                <span>{cartCount}</span>
            </div>

            <div className="flex justify-between">
                <span>Стоимость</span>
                <span>{formatPrice(regularPriceTotal)} ₸</span>
            </div>

            <div className="flex justify-between">
                <span>Скидка</span>
                <span>-{formatPrice(discountAmount)} ₸</span>
            </div>

            <div className="mt-6 flex justify-between gap-4">
                <span className="text-xl font-semibold">Итого:</span>
                <span className="text-lg font-semibold">
                    {formatPrice(effectivePriceTotal)} ₸
                </span>
            </div>
        </div>
    );
}
