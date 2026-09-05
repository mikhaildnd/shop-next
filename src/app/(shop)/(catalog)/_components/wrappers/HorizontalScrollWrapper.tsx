import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface HorizontalScrollWrapperProps {
    className?: string;
    children: ReactNode;
}

export function HorizontalScrollWrapper({
    children,
    className,
}: HorizontalScrollWrapperProps) {
    return (
        <div
            className={cn(className, '-mx-(--section-padding) overflow-x-auto')}
        >
            <div className="w-max px-(--section-padding)">{children}</div>
        </div>
    );
}
