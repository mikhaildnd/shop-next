import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug } from '@/services/product/product.service';
import { buildProductBreadcrumbs } from '@/lib/breadcrumbs/buildProductBreadcrumbs';
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs';
import ProductPageSlider from '@/app/(shop)/(catalog)/product/[productSlug]/_components/ProductPageSlider';
import ProductInfoCard from '@/app/(shop)/(catalog)/product/[productSlug]/_components/ProductInfoCard';
import ProductProperty from '@/app/(shop)/(catalog)/product/[productSlug]/_components/ProductProperty';
import { getCategoryPath } from '@/lib/category/get-category-path';
import { getCategories } from '@/services/category/category.service';
import HorizontalScrollWrapper from '@/components/shared/HorizontalSrollWrapper';

type ProductPageProps = {
    params: Promise<{
        productSlug: string;
    }>;
};

export async function generateMetadata({
    params,
}: ProductPageProps): Promise<Metadata> {
    const { productSlug } = await params;

    const product = await getProductBySlug(productSlug);

    if (!product) {
        return {
            title: 'Товар не найден',
        };
    }

    return {
        title: product.title,
        description: product.description ?? product.title,
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { productSlug } = await params;

    const [product, categories] = await Promise.all([
        getProductBySlug(productSlug),
        getCategories(),
    ]);

    if (!product) {
        notFound();
    }

    const categoryPath = product.category
        ? getCategoryPath(categories, product.category.id)
        : [];

    const breadcrumbs = buildProductBreadcrumbs({
        categoryPath,
        product: {
            title: product.title,
        },
    });

    const formattedIngredients =
        product.ingredients.length > 0
            ? product.ingredients.join(', ') + '.'
            : 'Состав не указан';

    return (
        <div className="page-spacing">
            {/*Breadcrumbs*/}
            <HorizontalScrollWrapper>
                <Breadcrumbs
                    className="py-4"
                    items={breadcrumbs}
                />
            </HorizontalScrollWrapper>

            {/*Main content*/}
            <div className="grid grid-cols-1 md:grid-cols-[480px_minmax(0,1fr)] md:gap-x-2 lg:gap-x-6 lg:gap-y-10">
                {/*Media section*/}
                <div className="-mx-(--section-padding) md:mx-0 lg:sticky lg:top-10 lg:self-start">
                    <ProductPageSlider
                        className="aspect-square w-full md:rounded-3xl"
                        slides={product.images}
                    />
                </div>

                <div className="flex flex-col gap-y-6 md:max-w-[460px]">
                    {/*Main  properties section*/}
                    <ProductInfoCard
                        product={product}
                        className="-mx-(--section-padding) md:mx-0"
                    />

                    {/*Other properties section*/}
                    {product.description && (
                        <ProductProperty
                            title="Описание"
                            content={product.description}
                        />
                    )}

                    {/*Other properties section*/}
                    <ProductProperty
                        title="Состав"
                        content={formattedIngredients}
                    />
                </div>
            </div>
        </div>
    );
}
