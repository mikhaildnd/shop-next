import Link from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface MainBannerCardText {
    title: string;
    description: string;
    textColor?: 'white' | 'black';
    textHorizontalPosition?: 'left' | 'center' | 'right';
    textVerticalPosition?: 'top' | 'center' | 'bottom';
}

interface MainBannerCardProps {
    href: string;
    bannerText: MainBannerCardText;
    className?: string;
    children?: ReactNode;
}

export function BannerCard({
    bannerText,
    className,
    children,
    href,
}: MainBannerCardProps) {
    const {
        title,
        description,
        textColor = 'black',
        textHorizontalPosition = 'left',
        textVerticalPosition = 'top',
    } = bannerText;

    const horizontalClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    }[textHorizontalPosition];

    const verticalClass = {
        top: 'items-start',
        center: 'items-center',
        bottom: 'items-end',
    }[textVerticalPosition];

    return (
        <Link
            className={cn(
                'relative flex h-[170px] overflow-hidden rounded',
                'w-full duration-300 hover:shadow-(--shadow-default) xl:h-50',
                verticalClass,
                className,
            )}
            href={href}
        >
            <div
                className={cn(
                    'flex flex-col gap-1.5 p-5',
                    horizontalClass,
                    textColor === 'white' ? 'text-white' : 'text-black',
                    children && 'z-2',
                    !children && 'w-full',
                )}
            >
                <h3
                    className={cn(
                        'line-clamp-2 text-xl font-bold xl:text-2xl',
                        children && 'max-w-[174px] xl:max-w-[258px]',
                    )}
                >
                    {title}
                </h3>
                <p className="line-clamp-4 text-xs xl:text-base">
                    {description}
                </p>
            </div>
            {children}
        </Link>
    );
}
