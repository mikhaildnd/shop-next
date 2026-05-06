import Image from 'next/image';
import clsx from 'clsx';
import Link from 'next/link';
import { socialLinks } from '@/consts/footerSocialLinks';

const hoverClass = 'transition-opacity duration-300 hover:opacity-80';

const FooterSocials = ({ className }: { className?: string }) => {
    return (
        <div className={clsx('flex flex-wrap', className)}>
            {socialLinks.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={hoverClass}
                >
                    <Image
                        className="rounded"
                        src={item.icon}
                        alt={item.alt}
                        width={24}
                        height={24}
                    />
                </Link>
            ))}
        </div>
    );
};

export default FooterSocials;
