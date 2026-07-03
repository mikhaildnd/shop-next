import Image from 'next/image';
import Link from 'next/link';

import { socialLinks } from '@/consts/footerSocialLinks';
import { cn } from '@/utils/cn';

const hoverClass = 'transition-opacity duration-300 hover:opacity-80';

export function FooterSocials({ className }: { className?: string }) {
    return (
        <div className={cn('flex flex-wrap', className)}>
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
}
