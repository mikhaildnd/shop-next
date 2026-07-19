import { Heart, ShoppingCart } from 'lucide-react';

import { NavigationItem } from '@/components/header/NavigationItem';
import { Profile } from '@/components/header/Profile';
import { routes } from '@/lib/routes';
import { cn } from '@/utils/cn';

export function DesktopNavigation({ className }: { className?: string }) {
    return (
        <ul className={cn('flex items-center', className)}>
            <li>
                <NavigationItem
                    href={routes.favoritesPage()}
                    Icon={Heart}
                    text="Избранное"
                />
            </li>
            <li>
                <NavigationItem
                    href={routes.cartPage()}
                    Icon={ShoppingCart}
                    text="Корзина"
                />
            </li>
            <li>
                <Profile />
            </li>
        </ul>
    );
}
