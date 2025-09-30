export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};