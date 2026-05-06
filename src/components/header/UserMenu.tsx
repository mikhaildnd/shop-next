import clsx from 'clsx';
import UserActions from '@/components/header/UserActions';
import Profile from '@/components/header/Profile';

const UserMenu = ({ className }: { className?: string }) => {
    return (
        <nav
            aria-label="основное меню"
            className={clsx(
                'flex h-(--bottom-nav-height) items-center gap-x-6 bg-white px-4 py-2 text-[8px] shadow-(--shadow-default)',
                'sm:gap-x-12 md:static md:h-auto md:gap-x-6 md:bg-inherit md:p-0 md:text-xs md:shadow-none',
                className,
            )}
        >
            <UserActions />
            <Profile className="ml-auto" />
        </nav>
    );
};

export default UserMenu;
