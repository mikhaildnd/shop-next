import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

import { useDropdownContext } from './DropdownContext';

interface DropdownContentProps {
    children: ReactNode;
    className?: string;
}

export function DropdownContent({ children, className }: DropdownContentProps) {
    const { isOpen } = useDropdownContext();

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className={cn(
                'absolute top-full right-0 z-50 overflow-hidden bg-white shadow-lg',
                className,
            )}
        >
            {children}
        </div>
    );
}
