import type { ReactNode } from 'react';

import { Logo } from '@/components/logo/Logo';
import { cn } from '@/utils/cn';

interface AuthSurfaceHeaderProps {
    title: string;
    description?: string;
    className?: string;
    children?: ReactNode;
}

export function AuthSurfaceHeader({
    title,
    description,
    className,
    children,
}: AuthSurfaceHeaderProps) {
    return (
        <div className={cn('flex flex-col items-center gap-4', className)}>
            <Logo />
            <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-semibold">{title}</h1>
                {description && <p>{description}</p>}
            </div>
            {children}
        </div>
    );
}
