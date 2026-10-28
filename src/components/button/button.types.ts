import type { ControlShape, ControlSize } from '@/lib/ui/ui-styles';

export type ButtonVariant =
    'primary' | 'outline' | 'destructive' | 'accent' | 'neutral';

export interface ButtonStyleProps {
    variant?: ButtonVariant;
    size?: ControlSize;
    shape?: ControlShape;
}
