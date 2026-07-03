import { ProductsSliderNavButton } from '@/components/product/productSlider/ProductsSliderNavButton';
import { cn } from '@/utils/cn';

interface ProductsSectionControlsProps {
    disabled: boolean;
    onPrev: () => void;
    onNext: () => void;
}

export function ProductsSectionControls({
    disabled,
    onPrev,
    onNext,
}: ProductsSectionControlsProps) {
    return (
        <div
            className={cn(
                'hidden items-center gap-2 transition-opacity duration-300 md:flex',
                disabled && 'pointer-events-none opacity-50',
            )}
        >
            <ProductsSliderNavButton
                direction="prev"
                onClick={onPrev}
            />

            <ProductsSliderNavButton
                direction="next"
                onClick={onNext}
            />
        </div>
    );
}
