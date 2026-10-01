import type { ComponentProps } from 'react';

import { Button } from '@/components/button/Button';
import { Spinner } from '@/components/Spinner';
import { cn } from '@/lib/cn';

interface LoadingButtonProps extends ComponentProps<typeof Button> {
    isLoading?: boolean;
    pendingText?: string;
}

export function LoadingButton({
    disabled,
    isLoading,
    pendingText,
    className,
    children,
    ...buttonProps
}: LoadingButtonProps) {
    return (
        <Button
            {...buttonProps}
            disabled={disabled}
            className={cn(isLoading && 'disabled:cursor-progress', className)}
        >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    {pendingText && <span>{pendingText}</span>}
                    <Spinner />
                </span>
            ) : (
                children
            )}
        </Button>
    );
}
