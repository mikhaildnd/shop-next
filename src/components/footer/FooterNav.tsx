import Link from 'next/link';

import { footerLinks } from '@/consts/footerSocialLinks';

const FooterNav = ({ className }: { className?: string }) => {
    return (
        <nav className={className}>
            <ul className="flex flex-col flex-wrap gap-y-3 text-sm md:flex-row md:gap-x-10">
                {footerLinks.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className="transition-colors hover:text-black"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default FooterNav;
