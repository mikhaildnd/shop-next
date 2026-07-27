import type { ComponentProps } from 'react';

import { Input } from '@/components/shared/Input';
import { cn } from '@/utils/cn';

interface FormInputProps extends ComponentProps<'input'> {
    error?: string;
}

export function FormInput({ error, className, ...props }: FormInputProps) {
    return (
        <div className="flex flex-col gap-1">
            <Input
                className={cn(
                    error &&
                        'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                    className,
                )}
                aria-invalid={!!error}
                {...props}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
