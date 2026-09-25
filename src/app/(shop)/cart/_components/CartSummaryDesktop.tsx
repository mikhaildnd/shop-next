'use client';

import { CartSummaryDesktopSkeleton } from '@/app/(shop)/cart/_components/CartSummaryDesktopSkeleton';
import { SummaryDetails } from '@/app/(shop)/cart/_components/SummaryDetails';
import { Button } from '@/components/button/Button';
import { LoadingButton } from '@/components/button/LoadingButton';
import { useCartContext } from '@/components/cart/CartContext';
import { cn } from '@/lib/cn';

interface CartSummaryDesktopProps {
    className?: string;
}

export function CartSummaryDesktop({ className }: CartSummaryDesktopProps) {
    const { isHydrated, productsState, cartSummary, retryProducts } =
        useCartContext();

    const isInitialLoading =
        productsState.status === 'loading' && !productsState.isRetry;

    const isRetrying =
        productsState.status === 'loading' && productsState.isRetry;

    const isProductsError = productsState.status === 'error';

    if (!isHydrated || isInitialLoading) {
        return <CartSummaryDesktopSkeleton className={className} />;
    }

    const shouldShowProductsError = isProductsError || isRetrying;

    return (
        <div
            className={cn(
                'relative rounded-md border border-gray-100 bg-white px-4 py-4 text-[#414141]',
                'sticky top-22',
                className,
            )}
        >
            <div className="grid w-full">
                <div
                    className={cn(
                        'col-start-1 row-start-1 flex flex-col gap-8',
                        shouldShowProductsError && 'invisible',
                    )}
                >
                    <SummaryDetails />

                    <Button disabled={cartSummary.isCheckoutDisabled}>
                        Перейти к оформлению
                    </Button>
                </div>

                {shouldShowProductsError && (
                    <div className="col-start-1 row-start-1 flex flex-col justify-between gap-8">
                        <div className="flex flex-col gap-2 border-l-4 border-red-400 pl-4">
                            <h3 className="text-2xl font-semibold">
                                Не удалось рассчитать стоимость заказа
                            </h3>

                            <p className="text-base text-gray-500">
                                Не удалось получить актуальные данные о товарах.
                                Попробуйте ещё раз.
                            </p>
                        </div>

                        <LoadingButton
                            onClick={retryProducts}
                            isLoading={isRetrying}
                            disabled={isRetrying}
                        >
                            Повторить
                        </LoadingButton>
                    </div>
                )}
            </div>
        </div>
    );
}
