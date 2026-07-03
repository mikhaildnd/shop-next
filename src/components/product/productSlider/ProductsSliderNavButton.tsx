import { cn } from '@/utils/cn';

interface ProductsSliderNavButtonProps {
    direction: 'prev' | 'next';
    onClick: () => void;
    isDisabled?: boolean;
}

export function ProductsSliderNavButton({
    direction,
    isDisabled = false,
    onClick,
}: ProductsSliderNavButtonProps) {
    return (
        <button
            type="button"
            disabled={isDisabled}
            onClick={onClick}
            className={cn(
                'flex items-center justify-center',
                'h-7 w-7 cursor-pointer rounded-full bg-gray-300 transition-colors',
                'hover:bg-(--color-primary) focus-visible:bg-(--color-primary) active:bg-(--color-green)',
            )}
        >
            <span
                className={cn(
                    'inline-block h-2.5 w-2.5 border-t-2 border-r-2 border-white transition-transform',
                    direction === 'next'
                        ? '-ml-0.5 rotate-45'
                        : 'ml-0.5 -rotate-135',
                )}
            />
            <span className="sr-only">
                {direction === 'prev' ? 'Предыдущий слайд' : 'Следующий слайд'}
            </span>
        </button>
    );
}
