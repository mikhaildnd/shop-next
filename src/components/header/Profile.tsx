import AvatarImage from '../../../public/images/graphics/profile.png';
import ArrowIcon from '../../../public/icons-header/icon-arrow.svg';
import Image from 'next/image';
import clsx from 'clsx';

const Profile = ({ className }: { className?: string }) => {
    return (
        <div className={clsx('flex items-center gap-2.5', className)}>
            <Image
                src={AvatarImage}
                alt="Ваш профиль"
                width={40}
                height={40}
                className="min-h-10 min-w-10 rounded-full"
            />
            <p className="hidden cursor-pointer p-2.5 xl:block">Михаил</p>
            <button className="hidden cursor-pointer p-2 xl:block">
                <Image
                    src={ArrowIcon}
                    alt="Меню профиля"
                    width={24}
                    height={24}
                    sizes="24px"
                />
            </button>
        </div>
    );
};

export default Profile;
