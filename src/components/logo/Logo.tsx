import Link from 'next/link';
import Image from 'next/image';
import LogoImage from '../../../public/icons/logo.png';
import clsx from 'clsx';

const Logo = ({ className }: { className?: string }) => {
    return (
        <Link
            href="/"
            aria-label="На главную"
            className={clsx('flex items-center', className)}
        >
            <Image
                className="h-auto w-auto shrink-0"
                src={LogoImage}
                alt="Логотип магазина"
                priority
                width={40}
                height={40}
            />
        </Link>
    );
};

export default Logo;
