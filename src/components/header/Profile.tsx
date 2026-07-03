import { CircleUser } from 'lucide-react';
import Image from 'next/image';

import { cn } from '@/utils/cn';

import ArrowIcon from '../../../public/icons-header/icon-arrow.svg';
import AvatarImage from '../../../public/images/graphics/profile.png';

export function Profile({ className }: { className?: string }) {
    const userImageIsAvailable = true;

    return (
        <div className={cn('flex items-center gap-2.5', className)}>
            {!userImageIsAvailable ? (
                <CircleUser className="h-10 w-10 stroke-1" />
            ) : (
                <Image
                    src={AvatarImage}
                    alt="Ваш профиль"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full"
                />
            )}
            <p className="hidden cursor-pointer p-2.5 xl:block">Михаил</p>
            <button className="hidden cursor-pointer p-2 xl:block">
                <ArrowIcon
                    //TODO сделать правильно ариа
                    aria-label="Меню профиля"
                    className="size-6"
                />
            </button>
        </div>
    );
}
