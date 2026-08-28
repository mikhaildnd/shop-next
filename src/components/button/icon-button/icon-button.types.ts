import type { ComponentProps, ReactElement } from 'react';

export type IconButtonSize = 'sm' | 'md';

export type IconButtonShape = 'round' | 'rounded' | 'square';

export interface IconButtonProps extends ComponentProps<'button'> {
    children: ReactElement;
    size?: IconButtonSize;
    shape?: IconButtonShape;
    useGroup?: boolean;
}
