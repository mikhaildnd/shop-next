import type { ProductListingIssue } from '@/lib/product-listing/types';
import type { PaginationIssue } from '@/lib/pagination/types';
import { PaginationIssues } from '@/components/page-issues/ui/PaginationIssues';
import { ProductListingIssues } from '@/components/page-issues/ui/ProductListingIssues';

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
