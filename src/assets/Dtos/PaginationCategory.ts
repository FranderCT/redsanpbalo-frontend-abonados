export type PaginationMeta = {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  page: number;
  pageCount: number;
  total: number;
};

// hasNextPage
// : 
// true
// hasPrevPage
// : 
// false
// limit
// : 
// 10
// page
// : 
// 1
// pageCount
// : 
// 2
// total
// : 
// 11

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};
