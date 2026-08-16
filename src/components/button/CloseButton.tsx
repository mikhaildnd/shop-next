import { X as IconClose } from 'lucide-react';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/cn';

type CloseButtonProps = ComponentProps<'button'>;

export function CloseButton({ className, ...props }: CloseButtonProps) {
    return (
        <button
            className={cn(
                'group/remove shrink-0 cursor-pointer rounded bg-white p-1 transition-colors hover:bg-gray-200 focus-visible:bg-gray-200 focus-visible:ring-1 focus-visible:ring-(--color-primary) focus-visible:outline-none md:p-1.5',
                className,
            )}
            {...props}
        >
            <IconClose className="size-5 text-gray-300 transition-colors group-hover/remove:text-gray-800 group-focus-visible/remove:text-gray-800" />
        </button>
    );
}
