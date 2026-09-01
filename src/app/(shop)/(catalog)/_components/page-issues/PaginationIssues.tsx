import { PAGINATION_ISSUE_GROUPS } from '@/app/(shop)/(catalog)/_components/page-issues/page-issues.constants';
import { ButtonLink } from '@/components/button/ButtonLink';
import { PageMessage } from '@/components/PageMessage';
import type { PaginationIssue } from '@/lib/pagination/pagination.types';
import { routes } from '@/routes';

interface PaginationIssuesProps {
    issues: PaginationIssue[];
}

export function PaginationIssues({ issues }: PaginationIssuesProps) {
    for (const group of PAGINATION_ISSUE_GROUPS) {
        if (group.issues.some((issue) => issues.includes(issue))) {
            return (
                <PageMessage
                    title={group.message.title}
                    description={group.message.description}
                >
                    <ButtonLink href={routes.catalogPage()}>
                        В каталог
                    </ButtonLink>
                </PageMessage>
            );
        }
    }

    return null;
}
