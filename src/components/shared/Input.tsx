import type { ComponentProps, Ref } from 'react';

import { cn } from '@/utils/cn';

interface InputProps extends ComponentProps<'input'> {
    ref?: Ref<HTMLInputElement>;
}

export function Input({ className, disabled, ref, ...props }: InputProps) {
    return (
        <input
            ref={ref}
            className={cn(
                'rounded border border-(--color-primary) px-3 py-1 transition-colors placeholder:text-(--placeholder-text-color)',
                'focus-ring',
                'disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500 disabled:opacity-100',
                className,
            )}
            disabled={disabled}
            {...props}
        />
    );
}
