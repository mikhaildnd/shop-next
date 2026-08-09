import Link from 'next/link';
import type { ComponentProps } from 'react';

import type {
    ButtonSize,
    ButtonVariant,
} from '@/components/shared/button/button.types';
import { cn } from '@/utils/cn';

interface ButtonLinkProps extends ComponentProps<typeof Link> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'button-primary',
    outline: 'button-outline',
    destructive: 'button-destructive',
    accent: 'button-accent',
};

const sizeClasses: Record<ButtonSize, string> = {
    xs: 'button-xs',
    sm: 'button-sm',
    md: 'button-md',
};

export function ButtonLink({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: ButtonLinkProps) {
    return (
        <Link
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
