import Link from 'next/link';
import type { ComponentProps } from 'react';

import {
    buttonContentSizeClasses,
    buttonVariantClasses,
} from '@/components/button/button.styles';
import type { ButtonStyleProps } from '@/components/button/button.types';
import { cn } from '@/lib/cn';
import { controlHeightClasses, controlShapeClasses } from '@/lib/ui/ui-styles';

interface ButtonLinkProps
    extends ComponentProps<typeof Link>, ButtonStyleProps {}

export function ButtonLink({
    className,
    variant = 'primary',
    size = 'md',
    shape = 'rounded',
    ...props
}: ButtonLinkProps) {
    return (
        <Link
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
