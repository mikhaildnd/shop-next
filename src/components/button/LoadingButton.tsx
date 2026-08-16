import type { ComponentProps } from 'react';

import { Button } from '@/components/button/Button';
import { cn } from '@/lib/cn';

interface LoadingButtonProps extends ComponentProps<typeof Button> {
    isLoading?: boolean;
    pendingText?: string;
}

function Spinner() {
    return (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    );
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
