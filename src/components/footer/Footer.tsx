import Link from 'next/link';

import { FooterNav } from '@/components/footer/FooterNav';
import { FooterPhone } from '@/components/footer/FooterPhone';
import { FooterSocials } from '@/components/footer/FooterSocials';
import { Logo } from '@/components/logo/Logo';
import { cn } from '@/utils/cn';

import styles from './Footer.module.css';

export function Footer({ className }: { className?: string }) {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            className={cn(
                'wrapper bg-white text-(--text-color-dark) shadow-(--shadow-default)',
                className,
            )}
        >
            <div
                className={cn(
                    styles.grid,
                    'items-center gap-x-6 gap-y-1 py-6 md:py-10',
                )}
            >
                <Logo className={styles.logo} />
                <FooterSocials
                    className={cn(
                        'gap-2 justify-self-end md:gap-5',
                        styles.social,
                    )}
                />
                <FooterPhone
                    className={cn(styles.phone, 'justify-self-end text-sm')}
                    phoneNumber="+7478241112"
                />
                <FooterNav className={styles.nav} />
            </div>
            <div className="flex flex-col gap-x-2 gap-y-2 border-t border-(--color-light-gray) py-2 text-sm md:flex-row md:py-4">
                <p>{`© ${currentYear} Next shop, Inc.`}</p>
                <Link
                    href="/"
                    className="text-xs text-(--color-primary) underline transition-colors hover:text-(--color-green)"
                >
                    Политика обработки персональных данных
                </Link>
            </div>
        </footer>
    );
}
