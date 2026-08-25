import { CartNavigationItem } from '@/components/header/CartNavigationItem';
import { FavoritesNavigationItem } from '@/components/header/FavoritesNavigationItem';
import { DesktopProfile } from '@/components/header/profile/DesktopProfile';
import type { ProfileUser } from '@/components/header/profile/profile.types';
import { cn } from '@/lib/cn';

interface DesktopNavigationProps {
    user: ProfileUser | null;
    className?: string;
}

export function DesktopNavigation({ user, className }: DesktopNavigationProps) {
    return (
        <ul className={cn('flex items-center lg:gap-1.5', className)}>
            <li>
                <FavoritesNavigationItem />
            </li>
            <li>
                <CartNavigationItem />
            </li>
            <li>
                <DesktopProfile user={user} />
            </li>
        </ul>
    );
}
