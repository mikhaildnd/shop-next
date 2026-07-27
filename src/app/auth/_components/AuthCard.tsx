import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface AuthCardProps {
    title: string;
    description: string;
    className?: string;
    children: ReactNode;
}

export function AuthCard({
    title,
    description,
    className,
    children,
}: AuthCardProps) {
    return (
        <div className={cn('flex flex-col', className)}>
            <h1 className="mb-2 text-3xl font-semibold">{title}</h1>
            <p className="mb-6">{description}</p>

            {children}
        </div>
    );
}
