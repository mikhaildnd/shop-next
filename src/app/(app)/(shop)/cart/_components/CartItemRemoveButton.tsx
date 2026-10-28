import { Trash2 as DeleteIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import { IconButton } from '@/components/button/IconButton';
import { cn } from '@/lib/cn';

type CartItemRemoveButtonProps = Omit<
    ComponentProps<typeof IconButton>,
    'children' | 'aria-label'
>;

export function CartItemRemoveButton({
    className,
    ...props
}: CartItemRemoveButtonProps) {
    return (
        <IconButton
            {...props}
            className={cn(
                'text-gray-400 hover:text-gray-600 active:text-gray-500 disabled:hover:text-gray-400 disabled:active:text-gray-400',
                className,
            )}
            aria-label="Удалить товар"
        >
            <DeleteIcon className="stroke-[1.5px]" />
        </IconButton>
    );
}
