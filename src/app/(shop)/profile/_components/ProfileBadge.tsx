import { cn } from '@/utils/cn';

interface ProfileBadgeProps {
    variant?: 'success' | 'warning';
    text: string;
}

export function ProfileBadge({ text, variant = 'success' }: ProfileBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex h-5 shrink-0 cursor-default items-center rounded-xl border bg-white px-2 text-xs font-medium whitespace-nowrap',
                variant === 'success' && 'border-green-600 text-green-600',
                variant === 'warning' && 'border-red-600 text-red-600',
            )}
        >
            {text}
        </span>
    );
}
