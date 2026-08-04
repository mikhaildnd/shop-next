import type { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

interface ButtonProps extends ComponentProps<'button'> {
    variant?: 'primary' | 'secondary' | 'destructive';
    size?: 'xs' | 'sm' | 'md';
}

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                'flex cursor-pointer items-center justify-center rounded py-1 focus-primary transition-colors hover:opacity-90 focus-visible:opacity-90 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                variant === 'primary' && 'bg-(--color-primary) text-white',
                variant === 'secondary' &&
                    'border border-(--color-primary) bg-white text-(--color-primary)',
                variant === 'destructive' &&
                    'border border-red-600 bg-white text-red-600 hover:bg-red-600 hover:text-white',
                size === 'xs' && 'h-6 px-1 text-xs',
                size === 'sm' && 'h-8 px-2 text-sm',
                size === 'md' && 'text-md h-10 px-3',
                className,
            )}
            {...props}
        />
    );
}
