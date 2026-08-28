import type {
    IconButtonProps,
    IconButtonShape,
    IconButtonSize,
} from '@/components/button/icon-button/icon-button.types';
import { cn } from '@/lib/cn';

const sizeClasses: Record<IconButtonSize, string> = {
    sm: 'size-8 [&>svg]:size-4',
    md: 'size-9 [&>svg]:size-5',
};

const shapeClasses: Record<IconButtonShape, string> = {
    round: 'rounded-full',
    rounded: 'rounded-md',
    square: '',
};

export function IconButton({
    children,
    className,
    size = 'md',
    shape = 'square',
    useGroup = false,
    ...props
}: IconButtonProps) {
    return (
        <button
            type="button"
            className={cn(
                'flex cursor-pointer items-center justify-center focus-ring transition-colors duration-150',
                sizeClasses[size],
                shapeClasses[shape],
                useGroup && 'group',
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}
