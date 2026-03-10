
export interface Category {
  Id: number;
  Name: string;
  Description: string;
  IsActive: boolean;
}

export interface NewCategory {
  Name: string;
  Description: string;
}

export const NewCategoryInitialState = {
  Name: "",
  Description: "",
};

export type CategoryStateFilter = "all" | "active" | "inactive";

export type CategoriesPaginationParams = {
  page?: number;
  limit?: number;
  q?: string;
  state?: boolean;
};

export interface UpdateCategoryDto {
  Name?: string;
  Description?: string;
  IsActive?: boolean;
}
