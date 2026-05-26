import IconHeart from '../../../public/icons-header/icon-heart.svg';
import IconBox from '../../../public/icons-header/icon-box.svg';
import IconCart from '../../../public/icons-header/icon-cart.svg';
import IconMenuMob from '../../../public/icons-header/icon-menu-mob.svg';
import UserActionItem from '@/components/header/UserActionItem';

const UserActions = () => {
    return (
        <ul className="flex grow items-end justify-between">
            <UserActionItem
                Icon={IconMenuMob}
                className="md:hidden"
                text="Меню"
            />
            <UserActionItem
                Icon={IconHeart}
                text="Избранное"
            />
            <UserActionItem
                Icon={IconBox}
                text="Заказы"
            />
            <UserActionItem
                Icon={IconCart}
                text="Корзина"
            />
        </ul>
    );
};

export default UserActions;
