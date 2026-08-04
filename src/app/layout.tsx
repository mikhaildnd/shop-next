import './globals.css';

import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

const fontMain = Rubik({
    variable: '--font-main',
    subsets: ['latin', 'cyrillic'],
    weight: ['300', '400', '500', '600', '700', '800'],
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
                {children}
            </body>
        </html>
    );
}
