import { Heart, House as IconHome, ShoppingCart } from 'lucide-react';

import { NavigationItem } from '@/components/header/NavigationItem';
import { Profile } from '@/components/header/Profile';
import { routes } from '@/lib/routes';
import { cn } from '@/utils/cn';

import IconMenuMob from '../../../public/icons-header/icon-menu-mob.svg';

export function MobileNavigation({ className }: { className?: string }) {
    return (
        <nav
            aria-label="основное меню"
            className={cn(
                'fixed right-0 bottom-0 left-0 z-40 flex h-(--bottom-nav-height) items-center gap-x-6 bg-white px-4 py-2 text-[8px] shadow-(--shadow-default)',
                'sm:gap-x-12',
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
                    <Profile />
                </li>
            </ul>
        </nav>
    );
}
