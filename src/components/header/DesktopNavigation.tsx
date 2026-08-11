import { Heart, ShoppingCart } from 'lucide-react';

import { NavigationItem } from '@/components/header/NavigationItem';
import { DesktopProfile } from '@/components/header/profile/DesktopProfile';
import type { ProfileUser } from '@/components/header/profile/profile.types';
import { routes } from '@/lib/routes';
import { cn } from '@/utils/cn';

interface DesktopNavigationProps {
    user: ProfileUser | null;
    className?: string;
}

export function DesktopNavigation({ user, className }: DesktopNavigationProps) {
    return (
        <ul className={cn('flex items-center lg:gap-1.5', className)}>
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
                <DesktopProfile user={user} />
            </li>
        </ul>
    );
}
