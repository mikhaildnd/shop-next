import { X as IconClose } from 'lucide-react';
import type { ComponentProps } from 'react';

import { IconButton } from '@/components/button/IconButton';

type CloseButtonProps = Omit<ComponentProps<typeof IconButton>, 'children'>;

export function CloseButton({
    size = 'sm',
    shape = 'rounded',
    type = 'button',
    'aria-label': ariaLabel = 'Закрыть',
    ...props
}: CloseButtonProps) {
    return (
        <IconButton
            type={type}
            aria-label={ariaLabel}
            size={size}
            shape={shape}
            {...props}
        >
            <IconClose />
        </IconButton>
    );
}
