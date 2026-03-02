
export type PaginationQuery = {
    q?: string;
    page?: number;
    limit: number;
    sortDir?: 'ASC' | 'DESC';
}