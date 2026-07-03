import { Heart, ShoppingBag,ShoppingCart } from 'lucide-react';

import { UserActionItem } from '@/components/header/UserActionItem';

import IconMenuMob from '../../../public/icons-header/icon-menu-mob.svg';

export function UserActions() {
    return (
        <ul className="flex grow items-end justify-between">
            <UserActionItem
                Icon={IconMenuMob}
                className="md:hidden"
                text="Меню"
            />
            <UserActionItem
                Icon={Heart}
                text="Избранное"
            />
            <UserActionItem
                Icon={ShoppingBag}
                text="Заказы"
            />
            <UserActionItem
                Icon={ShoppingCart}
                text="Корзина"
            />
        </ul>
    );
}
