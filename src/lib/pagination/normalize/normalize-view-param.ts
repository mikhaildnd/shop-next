import { PAGINATION_VIEWS } from '@/lib/pagination/consts';
import type { PaginationView } from '@/lib/pagination/types';

export function normalizeViewParam(value?: string): PaginationView {
    return value === PAGINATION_VIEWS.APPEND
        ? PAGINATION_VIEWS.APPEND
        : PAGINATION_VIEWS.SINGLE;
}
