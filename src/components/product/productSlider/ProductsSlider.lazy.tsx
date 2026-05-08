import dynamic from 'next/dynamic';
import ProductsSliderSkeleton from '@/components/product/productSlider/ProductsSliderSkeleton';

const ProductsSliderLazy = dynamic(() => import('./ProductsSlider'), {
    ssr: false,
    loading: () => <ProductsSliderSkeleton />,
});

export default ProductsSliderLazy;
