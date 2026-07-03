import type { PaginationIssue } from '@/lib/pagination/types';
import IssueMessage from '@/components/page-issues/ui/IssueMessage';
import { PAGINATION_ISSUE_GROUPS } from '@/components/page-issues/pagination-issue-groups';
import { GoToCatalogButton } from '@/components/page-issues/ui/GoToCatalogButton';

interface PaginationIssuesProps {
    issues: PaginationIssue[];
}

export function PaginationIssues({ issues }: PaginationIssuesProps) {
    for (const group of PAGINATION_ISSUE_GROUPS) {
        if (group.issues.some((issue) => issues.includes(issue))) {
            return (
                <IssueMessage
                    title={group.message.title}
                    description={group.message.description}
                >
                    <GoToCatalogButton />
                </IssueMessage>
            );
        }
    }

    return null;
}
