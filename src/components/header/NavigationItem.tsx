import Link from 'next/link';
import type { ComponentType, SVGProps } from 'react';

import { cn } from '@/utils/cn';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface NavigationItemProps {
    Icon: IconType;
    href: string;
    text?: string;
    className?: string;
}

export function NavigationItem(props: NavigationItemProps) {
    const { Icon, text, className, href } = props;

    return (
        <Link
            className={cn(
                'flex cursor-pointer flex-col items-center gap-1.5 p-2',
                className,
            )}
            href={href}
        >
            <Icon
                aria-label={text}
                className="size-5.5 stroke-[1.5px]"
            />
            <span className="text-xs">{text}</span>
        </Link>
    );
}
