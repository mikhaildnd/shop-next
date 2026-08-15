import { Heart, House as IconHome, ShoppingCart } from 'lucide-react';

import { NavigationItem } from '@/components/header/NavigationItem';
import { MobileProfile } from '@/components/header/profile/MobileProfile';
import type { ProfileUser } from '@/components/header/profile/profile.types';
import { cn } from '@/lib/cn';
import { routes } from '@/routes';

import IconMenuMob from '../../../public/icons-header/icon-menu-mob.svg';

interface MobileNavigationProps {
    user: ProfileUser | null;
    className?: string;
}

export function MobileNavigation({ user, className }: MobileNavigationProps) {
    return (
        <nav
            aria-label="Основное меню"
            className={cn(
                'fixed right-0 bottom-0 left-0 z-40 flex h-(--bottom-nav-height) items-center bg-white px-2 py-2 text-[8px] shadow-(--shadow-default)',
                className,
            )}
        >
            <ul className="flex grow items-center justify-between">
                <li>
                    <NavigationItem
                        href={routes.homePage()}
                        Icon={IconHome}
                        text="Главная"
                    />
                </li>
                <li>
                    <NavigationItem
                        href={routes.catalogPage()}
                        Icon={IconMenuMob}
                        text="Каталог"
                    />
                </li>
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
                    <MobileProfile user={user} />
                </li>
            </ul>
        </nav>
    );
}
