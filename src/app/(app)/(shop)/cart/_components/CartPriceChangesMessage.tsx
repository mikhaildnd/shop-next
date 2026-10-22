import { TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

import { CloseButton } from '@/components/button/CloseButton';

interface CartPriceChangesMessageProps {
    onClose: () => void;
    children: ReactNode;
}

export function CartPriceChangesMessage({
    onClose,
    children,
}: CartPriceChangesMessageProps) {
    return (
        <div className="mb-4 flex justify-between gap-2 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-2 shadow-sm sm:items-center sm:px-4 sm:py-3">
            <div className="flex grow gap-1.5">
                <TriangleAlert className="size-4 shrink-0 translate-y-0.5 text-amber-700 sm:translate-y-1" />

                <div className="flex flex-col items-start gap-y-1 sm:w-full sm:flex-row sm:items-center sm:justify-between sm:gap-x-3">
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

            <CloseButton
                onClick={onClose}
                variant="ghost"
                size="sm"
                aria-label="Закрыть сообщение"
            />
        </div>
    );
}
