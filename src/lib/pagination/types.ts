export type PaginationView = 'single' | 'append';

export type PaginationSearchParams = {
    page?: string;
    view?: PaginationView;
    from?: string;
};
