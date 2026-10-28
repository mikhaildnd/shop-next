import type { ComponentProps, ReactElement } from 'react';

import { buttonIconSizeClasses } from '@/components/button/button.styles';
import { cn } from '@/lib/cn';
import type { ControlShape, ControlSize } from '@/lib/ui/ui-styles';
import { controlShapeClasses, controlSizeClasses } from '@/lib/ui/ui-styles';

type IconButtonVariant = 'default' | 'ghost';

export interface IconButtonProps extends ComponentProps<'button'> {
    children: ReactElement;
    size?: ControlSize;
    shape?: ControlShape;
    useGroup?: boolean;
    variant?: IconButtonVariant;
}

const variantClasses: Record<IconButtonVariant, string> = {
    default:
        'bg-transparent hover:bg-muted focus-visible:bg-muted text-gray-500 hover:text-gray-800 focus-visible:text-gray-800',
    ghost: 'bg-transparent',
};

export function IconButton({
    children,
    className,
    size = 'md',
    shape = 'rounded',
    useGroup = false,
    variant = 'default',
    ...props
}: IconButtonProps) {
    return (
        <button
            type="button"
            className={cn(
                'flex shrink-0 items-center justify-center focus-ring transition-colors duration-150 disabled:cursor-default disabled:opacity-50',
                controlSizeClasses[size],
                buttonIconSizeClasses[size],
                controlShapeClasses[shape],
                variantClasses[variant],
                useGroup && 'group',
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}
