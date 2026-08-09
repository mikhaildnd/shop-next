import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface FormGroupProps {
    error?: string;
    className?: string;
    children: ReactNode;
}

export function FormGroup({ error, className, children }: FormGroupProps) {
    return (
        <div className={cn('flex flex-col gap-1', className)}>
            <div className="flex flex-col gap-1">{children}</div>

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
