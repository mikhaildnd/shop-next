import { PaginationIssues } from '@/app/(shop)/(catalog)/_components/page-issues/PaginationIssues';
import { ProductListingIssues } from '@/app/(shop)/(catalog)/_components/page-issues/ProductListingIssues';
import type { ProductListingIssue } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import type { PaginationIssue } from '@/lib/pagination/pagination.types';

interface PageIssuesProps {
    listingIssues: ProductListingIssue[];
    paginationIssues: PaginationIssue[];
}

export function PageIssues({
    listingIssues,
    paginationIssues,
}: PageIssuesProps) {
    if (paginationIssues.length > 0) {
        return <PaginationIssues issues={paginationIssues} />;
    }

    if (listingIssues.length > 0) {
        return <ProductListingIssues issues={listingIssues} />;
    }

    return null;
}
