// src/Modules/Category/Models/Pagination.ts
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

export type CategoriesPaginationParams = {
  page?: number;
  limit?: number;
  name?: string;
  state?: string;
};
