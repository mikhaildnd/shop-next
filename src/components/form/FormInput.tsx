import type { ComponentProps } from 'react';

import { Input } from '@/components/shared/Input';
import { cn } from '@/utils/cn';

interface FormInputProps extends ComponentProps<'input'> {
    error?: string;
}

export function FormInput({ error, className, ...props }: FormInputProps) {
    return (
        <Input
            className={cn(
                'h-10',
                error &&
                    'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                className,
            )}
            aria-invalid={!!error}
            {...props}
        />
    );
}
