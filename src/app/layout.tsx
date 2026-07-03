import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

import { Footer } from '@/components/footer/Footer';
import { Header } from '@/components/header/Header';
import { cn } from '@/utils/cn';

const fontMain = Inter({
    variable: '--font-main',
    subsets: ['latin', 'cyrillic'],
    weight: ['400'],
});

export const metadata: Metadata = {
    title: 'Internet shop Next',
    description: 'Internet shop Next',
};

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="ru">
            <body
                className={cn(
                    'flex min-h-screen flex-col antialiased',
                    fontMain.variable,
                )}
            >
                <Header />
                <main className="wrapper grow">{children}</main>
                <Footer className="pb-(--bottom-nav-height) md:pb-0" />
            </body>
        </html>
    );
}
