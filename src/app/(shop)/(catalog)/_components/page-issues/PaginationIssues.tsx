import { GoToCatalogButton } from '@/app/(shop)/(catalog)/_components/page-issues/GoToCatalogButton';
import { IssueMessage } from '@/app/(shop)/(catalog)/_components/page-issues/IssueMessage';
import { PAGINATION_ISSUE_GROUPS } from '@/app/(shop)/(catalog)/_components/page-issues/page-issues.constants';
import type { PaginationIssue } from '@/lib/pagination/pagination.types';

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
