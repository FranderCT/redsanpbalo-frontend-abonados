export type PaginationMeta = {
    total: number;
    itemCount: number;
    limit: number;
    pageCount: number;
    page: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
};

export type PaginatedResponse<T> = {
    data: T[];
    meta: PaginationMeta;
};