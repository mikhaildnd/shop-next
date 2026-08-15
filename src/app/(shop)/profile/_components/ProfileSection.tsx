import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface ProfileSectionProps {
    title: string;
    variant?: 'default' | 'destructive';
    className?: string;
    children: ReactNode;
}

export function ProfileSection({
    title,
    variant = 'default',
    className,
    children,
}: ProfileSectionProps) {
    return (
        <section className={className}>
            <div className="mb-4 border-b border-gray-200 pb-2">
                <h2
                    className={cn(
                        'text-xl font-medium',
                        variant === 'default' && 'text-black',
                        variant === 'destructive' &&
                            'text-(--color-destructive)',
                    )}
                >
                    {title}
                </h2>
            </div>
            {children}
        </section>
    );
}
