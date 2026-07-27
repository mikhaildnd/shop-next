import type { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <main className="flex min-h-screen w-full flex-col items-center justify-center bg-(--color-primary)">
            <section className="w-full max-w-98 rounded-2xl bg-white p-6">
                {children}
            </section>
        </main>
    );
}
