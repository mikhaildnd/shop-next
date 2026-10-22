import { X as IconClose } from 'lucide-react';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/cn';

type CloseButtonSize = 'sm' | 'md' | 'lg';
type CloseButtonVariant = 'default' | 'ghost';

interface CloseButtonProps extends ComponentProps<'button'> {
    size?: CloseButtonSize;
    variant?: CloseButtonVariant;
}

const sizeClasses: Record<CloseButtonSize, string> = {
    sm: 'size-7 [&_svg]:size-4',
    md: 'size-8 [&_svg]:size-5',
    lg: 'size-10 [&_svg]:size-6',
};

const variantClasses: Record<CloseButtonVariant, string> = {
    default: 'bg-white hover:bg-muted focus-visible:bg-muted',
    ghost: 'bg-transparent',
};

export function CloseButton({
    size = 'md',
    variant = 'default',
    type = 'button',
    'aria-label': ariaLabel = 'Закрыть',
    className,
    ...props
}: CloseButtonProps) {
    return (
        <button
            type={type}
            aria-label={ariaLabel}
            className={cn(
                'group/remove flex shrink-0 cursor-pointer items-center justify-center rounded transition-colors focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:outline-none disabled:opacity-50',
                sizeClasses[size],
                variantClasses[variant],
                className,
            )}
            {...props}
        >
            <IconClose className="text-gray-600 transition-colors group-hover/remove:text-gray-800 group-focus-visible/remove:text-gray-800" />
        </button>
    );
}
