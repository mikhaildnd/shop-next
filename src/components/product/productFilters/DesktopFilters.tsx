import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface DesktopFiltersProps {
    children: ReactNode;
    className?: string;
}

export function DesktopFilters({ children, className }: DesktopFiltersProps) {
    return (
        <aside
            className={cn(
                'sticky top-4 flex max-h-[calc(100vh-2rem)] flex-col overflow-y-auto rounded-xl border border-gray-100 bg-white',
                className,
            )}
        >
            {children}
        </aside>
    );
}
