import dynamic from 'next/dynamic';

import { ProductsSliderSkeleton } from '@/components/product/productSlider/ProductsSliderSkeleton';

export const ProductsSliderLazy = dynamic(
    () =>
        import('./ProductsSlider').then((module) => ({
            default: module.ProductsSlider,
        })),
    {
        ssr: false,
        loading: () => <ProductsSliderSkeleton />,
    },
);
