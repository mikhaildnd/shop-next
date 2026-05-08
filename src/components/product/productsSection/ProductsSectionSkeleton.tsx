import ProductsSliderSkeleton from '@/components/product/productSlider/ProductsSliderSkeleton';
import ProductsSectionHeaderSkeleton from '@/components/product/productsSection/ProductsSectionHeaderSkeleton';

const ProductsSectionSkeleton = () => {
    return (
        <section className="flex flex-col">
            <ProductsSectionHeaderSkeleton />

            <div className="min-h-[260px] sm:min-h-[300px] lg:min-h-[400px]">
                <ProductsSliderSkeleton />
            </div>
        </section>
    );
};

export default ProductsSectionSkeleton;
