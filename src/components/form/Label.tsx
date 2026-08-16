import type { ComponentProps } from 'react';

import { cn } from '@/lib/cn';

type LabelProps = ComponentProps<'label'>;

export function Label({ className, ...props }: LabelProps) {
    return (
        <label
            className={cn('block text-[14px] font-[600]', className)}
            {...props}
        />
    );
}
