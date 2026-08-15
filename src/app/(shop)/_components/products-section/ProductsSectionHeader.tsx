import Link from 'next/link';
import type { ReactNode } from 'react';

interface ProductsSectionHeaderProps {
    title: string;
    link: string;
    showLink?: boolean;
    children?: ReactNode;
}

export function ProductsSectionHeader({
    title,
    link,
    showLink = true,
    children,
}: ProductsSectionHeaderProps) {
    return (
        <div className="mb-4 flex gap-x-5 md:mb-8 md:gap-x-10">
            <h3 className="line-clamp-2 grow text-2xl font-bold text-[#333] xl:text-4xl">
                {title}
            </h3>

            {showLink && (
                <Link
                    href={link}
                    className="flex shrink items-center gap-x-2 transition-opacity"
                >
                    <span className="text-base whitespace-nowrap text-[#333] underline transition-colors hover:text-(--color-primary)">
                        Посмотреть все
                    </span>
                </Link>
            )}

            {children}
        </div>
    );
}
