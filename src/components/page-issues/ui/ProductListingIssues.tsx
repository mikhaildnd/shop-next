import type { ProductListingIssue } from '@/lib/product-listing/types';
import IssueMessage from '@/components/page-issues/ui/IssueMessage';
import { PRODUCT_LISTING_ISSUE_GROUPS } from '@/components/page-issues/product-listing-issue-groups';
import { ResetProductListingButton } from '@/components/page-issues/ui/ResetProductListingButton';

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
