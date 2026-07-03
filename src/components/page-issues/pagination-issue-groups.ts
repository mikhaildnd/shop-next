import { PAGINATION_ISSUES } from '@/lib/pagination/consts';
import type { PaginationIssue } from '@/lib/pagination/types';

type IssueMessage = {
    title: string;
    description: string;
};

type PaginationIssueGroup = {
    issues: readonly PaginationIssue[];
    message: IssueMessage;
};

const INVALID_PAGINATION_MESSAGE = {
    title: 'Некорректный параметр страницы',
    description: 'Запрошенная страница не может быть отображена',
} satisfies IssueMessage;

export const PAGINATION_ISSUE_GROUPS = [
    {
        issues: [
            PAGINATION_ISSUES.INVALID_PAGE,
            PAGINATION_ISSUES.FROM_GREATER_THAN_PAGE,
            PAGINATION_ISSUES.INVALID_FROM,
            PAGINATION_ISSUES.INVALID_VIEW,
            PAGINATION_ISSUES.FROM_WITHOUT_APPEND,
        ],
        message: INVALID_PAGINATION_MESSAGE,
    },
] satisfies readonly PaginationIssueGroup[];
