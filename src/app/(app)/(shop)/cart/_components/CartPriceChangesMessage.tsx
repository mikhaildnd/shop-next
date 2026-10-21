import { TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

interface CartPriceChangesMessageProps {
    children: ReactNode;
}

export function CartPriceChangesMessage({
    children,
}: CartPriceChangesMessageProps) {
    return (
        <div className="mb-4 flex flex-col rounded-md border border-amber-200 bg-amber-50 px-2.5 py-2 shadow-md sm:gap-2 sm:px-4 sm:py-3">
            <div className="flex gap-1.5">
                <TriangleAlert className="size-4 shrink-0 translate-y-0.5 text-amber-700 sm:translate-y-1" />

                <div className="flex flex-col items-start gap-1 sm:w-full sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col">
                        <h3 className="text-sm font-semibold text-amber-700 sm:text-base">
                            Цена некоторых товаров изменилась
                        </h3>
                        <p className="text-xs text-amber-800 sm:text-sm">
                            Проверьте цены перед оформлением заказа.
                        </p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
