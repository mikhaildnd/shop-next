'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

import { useCartContext } from '@/components/cart/CartContext';
import { cn } from '@/lib/cn';
import { routes } from '@/routes';

interface CartNavigationItemProps {
    className?: string;
}

export function CartNavigationItem({ className }: CartNavigationItemProps) {
    const { cartCount } = useCartContext();

    return (
        <Link
            className={cn(
                'flex cursor-pointer flex-col items-center gap-1.5 p-1',
                className,
            )}
            href={routes.cartPage()}
        >
            <div className="relative">
                <ShoppingCart
                    aria-label="Корзина"
                    className="size-5.5 stroke-[1.5px] transition-[fill] duration-150"
                />

                {cartCount > 0 && (
                    <span className="absolute -top-2 left-[calc(50%+4px)] flex h-4 min-w-4 items-center justify-center rounded-full bg-(--color-primary) px-1 text-xs text-white">
                        {cartCount}
                    </span>
                )}
            </div>

            <span className="text-xs">Корзина</span>
        </Link>
    );
}
