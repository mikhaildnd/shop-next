import Image from 'next/image';
import Link from 'next/link';

import { routes } from '@/lib/routes';
import { cn } from '@/utils/cn';

import LogoImage from '../../../public/icons/logo.png';

export function Logo({ className }: { className?: string }) {
    return (
        <Link
            href={routes.homePage()}
            aria-label="На главную"
            className={cn('flex items-center', className)}
        >
            <Image
                className="shrink-0"
                src={LogoImage}
                alt="Логотип магазина"
                priority
                width={42}
                height={42}
            />
        </Link>
    );
}
