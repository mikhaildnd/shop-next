import { Trash2 as DeleteIcon } from 'lucide-react';

import type { IconButtonProps } from '@/components/button/icon-button/icon-button.types';
import { IconButton } from '@/components/button/icon-button/IconButton';
import { cn } from '@/lib/cn';

interface CartItemRemoveButtonProps extends Omit<
    IconButtonProps,
    'children' | 'aria-label' | 'onClick'
> {
    iconClassName?: string;
}

export function CartItemRemoveButton({
    iconClassName,
    className,
    ...props
}: CartItemRemoveButtonProps) {
    return (
        <IconButton
            {...props}
            className={cn(
                'text-gray-400 hover:text-gray-600 active:text-gray-500',
                className,
            )}
            aria-label="Удалить товар"
        >
            <DeleteIcon className={cn('stroke-[1.5px]', iconClassName)} />
        </IconButton>
    );
}
