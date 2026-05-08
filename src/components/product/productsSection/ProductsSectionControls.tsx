import clsx from 'clsx';
import ProductsSliderNavButton from '@/components/product/productSlider/ProductsSliderNavButton';

interface ProductsSectionControlsProps {
    disabled: boolean;
    onPrev: () => void;
    onNext: () => void;
}

const ProductsSectionControls = ({
    disabled,
    onPrev,
    onNext,
}: ProductsSectionControlsProps) => {
    return (
        <div
            className={clsx(
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
};

export default ProductsSectionControls;
