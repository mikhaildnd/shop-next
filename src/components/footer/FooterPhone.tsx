import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/utils/cn';

interface FooterPhoneProps {
    phoneNumber: string;
    className?: string;
    withIcon?: boolean;
}

export function FooterPhone(props: FooterPhoneProps) {
    const { phoneNumber, className, withIcon = false } = props;

    return (
        <Link
            href={`tel:${phoneNumber}`}
            className={cn(
                'flex items-center transition-opacity hover:opacity-80',
                withIcon && 'gap-1',
                className,
            )}
        >
            {withIcon && (
                <Image
                    src="/icons/icon-phone.svg"
                    alt=""
                    aria-hidden="true"
                    width={22}
                    height={22}
                />
            )}

            <span className="text-(--color-primary) underline transition-colors hover:text-(--color-green)">
                {phoneNumber}
            </span>
        </Link>
    );
}
