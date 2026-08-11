import type { ReactNode } from 'react';

import { Footer } from '@/components/footer/Footer';
import { Header } from '@/components/header/Header';

interface ShopLayoutProps {
    children: ReactNode;
}

export default function ShopLayout({ children }: ShopLayoutProps) {
    return (
        <>
            <Header />
            <main className="wrapper grow overflow-x-hidden">{children}</main>
            <Footer className="pb-(--bottom-nav-height) md:pb-0" />
        </>
    );
}
