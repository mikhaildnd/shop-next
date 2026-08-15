import type { ComponentProps } from 'react';

import type {
    ButtonSize,
    ButtonVariant,
} from '@/components/button/button.types';
import { cn } from '@/lib/cn';

interface ButtonProps extends ComponentProps<'button'> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'button-primary',
    outline: 'button-outline',
    destructive: 'button-destructive',
    accent: 'button-accent',
    neutral: 'button-neutral',
};

const sizeClasses: Record<ButtonSize, string> = {
    xs: 'button-xs',
    sm: 'button-sm',
    md: 'button-md',
};

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                'button-base',
                variantClasses[variant],
                sizeClasses[size],
                className,
            )}
            {...props}
        />
    );
}
