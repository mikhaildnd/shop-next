import { HorizontalScrollWrapper } from '@/app/(shop)/(catalog)/_components/wrappers/HorizontalScrollWrapper';
import { CartContent } from '@/app/(shop)/cart/_components/CartContent';
import { Breadcrumbs } from '@/components/breadcrumbs/Breadcrumbs';
import type { BreadcrumbItem } from '@/components/breadcrumbs/breadcrumbs.types';
import { routes } from '@/routes';

export default async function CartPage() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            label: 'Главная',
            href: routes.homePage(),
        },
        {
            label: 'Корзина',
        },
    ];

    return (
        <div className="page-spacing">
            <HorizontalScrollWrapper>
                <Breadcrumbs
                    items={breadcrumbs}
                    className="py-4"
                />
            </HorizontalScrollWrapper>

            <h1 className="mb-2 catalog-heading xl:mb-3">Корзина</h1>

            <CartContent />
        </div>
    );
}
