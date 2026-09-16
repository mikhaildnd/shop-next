import { HorizontalScrollWrapper } from '@/app/(shop)/(catalog)/_components/wrappers/HorizontalScrollWrapper';
import { AuthenticatedCartContent } from '@/app/(shop)/cart/_components/AuthenticatedCartContent';
import { GuestCartContent } from '@/app/(shop)/cart/_components/GuestCartContent';
import { Breadcrumbs } from '@/components/breadcrumbs/Breadcrumbs';
import type { BreadcrumbItem } from '@/components/breadcrumbs/breadcrumbs.types';
import { getSession } from '@/auth/session';
import { routes } from '@/routes';

export default async function CartPage() {
    const session = await getSession();

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

            {session ? (
                <AuthenticatedCartContent userId={session.user.id} />
            ) : (
                <GuestCartContent />
            )}
        </div>
    );
}
