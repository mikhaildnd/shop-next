import IconMenuMob from '../../../public/icons-header/icon-menu-mob.svg';
import UserActionItem from '@/components/header/UserActionItem';
import { Heart, ShoppingCart, ShoppingBag } from 'lucide-react';

const UserActions = () => {
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
};

export default UserActions;
