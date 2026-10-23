import { Check } from 'lucide-react';

import { cn } from '@/lib/cn';

type CheckboxVariant = 'primary' | 'cart';

interface CheckboxProps {
    id: string;
    checked: boolean;
    label?: string;
    ariaLabel?: string;
    onChange: (checked: boolean) => void;
    variant?: CheckboxVariant;
    className?: string;
}

const variantClasses: Record<CheckboxVariant, string> = {
    primary:
        'border border-(--color-primary) peer-checked:bg-(--color-primary) bg-white',
    cart: 'border border-gray-200 bg-gray-50 peer-checked:bg-(--color-primary) peer-checked:border-(--color-primary)',
};

export function Checkbox({
    id,
    checked,
    label,
    ariaLabel,
    onChange,
    variant = 'primary',
    className,
}: CheckboxProps) {
    return (
        <label
            htmlFor={id}
            className={cn(
                'flex cursor-pointer items-center gap-x-2',
                className,
            )}
        >
            <input
                className="peer sr-only"
                autoComplete="off"
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                aria-label={ariaLabel}
            />

            <span
                aria-hidden
                className={cn(
                    'flex h-5 w-5 items-center justify-center rounded peer-focus-ring transition-colors [&>svg]:opacity-0 [&>svg]:transition-opacity peer-checked:[&>svg]:opacity-100',
                    variantClasses[variant],
                )}
            >
                <Check className="h-3.5 w-3.5 text-white" />
            </span>

            {label && <span className="text-base text-gray-700">{label}</span>}
        </label>
    );
}
