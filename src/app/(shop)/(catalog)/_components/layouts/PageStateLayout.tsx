import type { ReactNode } from 'react';

import { HorizontalScrollWrapper } from '@/app/(shop)/(catalog)/_components/wrappers/HorizontalScrollWrapper';
import { Breadcrumbs } from '@/components/breadcrumbs/Breadcrumbs';
import type { BreadcrumbItem } from '@/components/breadcrumbs/breadcrumbs.types';

interface PageStateLayoutProps {
    title: string;
    breadcrumbs: BreadcrumbItem[];
    tags?: ReactNode;
    children: ReactNode;
}

export function PageStateLayout({
    title,
    breadcrumbs,
    tags,
    children,
}: PageStateLayoutProps) {
    return (
        <div className="page-spacing">
            <HorizontalScrollWrapper>
                <Breadcrumbs
                    items={breadcrumbs}
                    className="py-4"
                />
            </HorizontalScrollWrapper>

            <h1 className="mb-2 catalog-heading xl:mb-3">{title}</h1>

            {tags && (
                <HorizontalScrollWrapper className="mb-3">
                    {tags}
                </HorizontalScrollWrapper>
            )}

            {children}
        </div>
    );
}
