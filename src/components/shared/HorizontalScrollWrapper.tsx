import type { PropsWithChildren } from 'react';
import { cn } from '@/utils/cn';

interface HorizontalScrollWrapperProps extends PropsWithChildren {
    className?: string;
}

export default function HorizontalScrollWrapper({
    children,
    className,
}: HorizontalScrollWrapperProps) {
    return (
        <div
            className={cn(className, '-mx-(--section-padding) overflow-x-auto')}
        >
            <div className="px-(--section-padding)">{children}</div>
        </div>
    );
}
