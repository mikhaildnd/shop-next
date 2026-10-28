import type { ComponentProps } from 'react';

import {
    buttonContentSizeClasses,
    buttonVariantClasses,
} from '@/components/button/button.styles';
import type { ButtonStyleProps } from '@/components/button/button.types';
import { cn } from '@/lib/cn';
import { controlHeightClasses, controlShapeClasses } from '@/lib/ui/ui-styles';

interface ButtonProps extends ComponentProps<'button'>, ButtonStyleProps {}

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    shape = 'rounded',
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                'button-base',
                buttonVariantClasses[variant],
                controlHeightClasses[size],
                buttonContentSizeClasses[size],
                controlShapeClasses[shape],
                className,
            )}
            {...props}
        />
    );
}
