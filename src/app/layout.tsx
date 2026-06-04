import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import type { ReactNode } from 'react';
import clsx from 'clsx';

const fontMain = Inter({
    variable: '--font-main',
    subsets: ['latin', 'cyrillic'],
    weight: ['400'],
});

export const metadata: Metadata = {
    title: 'Internet shop Next',
    description: 'Internet shop Next',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="ru">
            <body
                className={clsx(
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
