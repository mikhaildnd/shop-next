import IconHeart from '../../../public/icons-header/icon-heart.svg';
import IconBox from '../../../public/icons-header/icon-box.svg';
import IconCart from '../../../public/icons-header/icon-cart.svg';
import IconMenuMob from '../../../public/icons-header/icon-menu-mob.svg';
import UserActionItem from '@/components/header/UserActionItem';

const UserActions = () => {
    return (
        <ul className="flex grow items-center justify-between">
            <UserActionItem
                className="md:hidden"
                src={IconMenuMob}
                alt="Меню"
                text="Меню"
            />
            <UserActionItem
                src={IconHeart}
                alt="Избранное"
                text="Избранное"
            />
            <UserActionItem
                src={IconBox}
                alt="Заказы"
                text="Заказы"
            />
            <UserActionItem
                src={IconCart}
                alt="Корзина"
                text="Корзина"
            />
        </ul>
    );
};

export default UserActions;
