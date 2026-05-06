import Image from 'next/image';
import clsx from 'clsx';
import Link from 'next/link';

interface FooterPhoneProps {
    phoneNumber: string;
    className?: string;
    withIcon?: boolean;
}

const FooterPhone = (props: FooterPhoneProps) => {
    const { phoneNumber, className, withIcon = false } = props;

    return (
        <Link
            href={`tel:${phoneNumber}`}
            className={clsx(
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
};

export default FooterPhone;
