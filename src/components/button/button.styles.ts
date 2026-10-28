import type { ButtonVariant } from '@/components/button/button.types';
import type { ControlSize } from '@/lib/ui/ui-styles';

export const buttonContentSizeClasses: Record<ControlSize, string> = {
    xs: 'button-content-xs',
    sm: 'button-content-sm',
    md: 'button-content-md',
};

export const buttonIconSizeClasses: Record<ControlSize, string> = {
    xs: 'button-icon-xs',
    sm: 'button-icon-sm',
    md: 'button-icon-md',
};

export const buttonVariantClasses: Record<ButtonVariant, string> = {
    primary: 'button-primary',
    outline: 'button-outline',
    destructive: 'button-destructive',
    accent: 'button-accent',
    neutral: 'button-neutral',
};
