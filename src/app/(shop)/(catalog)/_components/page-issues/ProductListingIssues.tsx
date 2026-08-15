import { IssueMessage } from '@/app/(shop)/(catalog)/_components/page-issues/IssueMessage';
import { PRODUCT_LISTING_ISSUE_GROUPS } from '@/app/(shop)/(catalog)/_components/page-issues/page-issues.constants';
import { ResetProductListingButton } from '@/app/(shop)/(catalog)/_components/page-issues/ResetProductListingButton';
import type { ProductListingIssue } from '@/app/(shop)/(catalog)/lib/product-listing/product-listing.types';

interface ProductListingIssuesProps {
    issues: ProductListingIssue[];
}

export function ProductListingIssues({ issues }: ProductListingIssuesProps) {
    for (const group of PRODUCT_LISTING_ISSUE_GROUPS) {
        if (group.issues.some((issue) => issues.includes(issue))) {
            return (
                <IssueMessage
                    title={group.message.title}
                    description={group.message.description}
                >
                    <ResetProductListingButton />
                </IssueMessage>
            );
        }
    }

    return null;
}
