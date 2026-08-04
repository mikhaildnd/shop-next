import type { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

interface ButtonProps extends ComponentProps<'button'> {
    variant?: 'primary' | 'secondary';
}

export function Button({
    className,
    variant = 'primary',
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                'flex h-10 cursor-pointer items-center justify-center rounded px-3 py-1 focus-primary transition-opacity hover:opacity-90 focus-visible:opacity-90 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                variant === 'primary' && 'bg-(--color-primary) text-white',
                variant === 'secondary' &&
                    'border border-(--color-primary) bg-white text-(--color-primary)',
                className,
            )}
            {...props}
        />
    );
}
