'use client';

import type { ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/shared/button/Button';

interface SubmitButtonProps extends ComponentProps<typeof Button> {
    pendingText?: string;
}

function Spinner() {
    return (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    );
}

export function SubmitButton({
    pendingText,
    children,
    disabled,
    ...props
}: SubmitButtonProps) {
    const { pending } = useFormStatus();

    return (
        <Button
            {...props}
            type="submit"
            disabled={disabled || pending}
        >
            {pending ? (
                <span className="flex items-center justify-center gap-3">
                    {pendingText && <span>{pendingText}</span>}
                    <Spinner />
                </span>
            ) : (
                children
            )}
        </Button>
    );
}
