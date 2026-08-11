import type { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <main className="min-h-screen w-full bg-white md:bg-(--color-primary)">
            {children}
        </main>
    );
}
