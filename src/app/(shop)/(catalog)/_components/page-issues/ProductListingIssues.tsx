import { PRODUCT_LISTING_ISSUE_GROUPS } from '@/app/(shop)/(catalog)/_components/page-issues/page-issues.constants';
import { ResetProductListingButton } from '@/app/(shop)/(catalog)/_components/page-issues/ResetProductListingButton';
import type { ProductListingIssue } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';
import { PageMessage } from '@/components/PageMessage';

interface ProductListingIssuesProps {
    issues: ProductListingIssue[];
}

export function ProductListingIssues({ issues }: ProductListingIssuesProps) {
    for (const group of PRODUCT_LISTING_ISSUE_GROUPS) {
        if (group.issues.some((issue) => issues.includes(issue))) {
            return (
                <PageMessage
                    title={group.message.title}
                    description={group.message.description}
                >
                    <ResetProductListingButton />
                </PageMessage>
            );
        }
    }

    return null;
}
