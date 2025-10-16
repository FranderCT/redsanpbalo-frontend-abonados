
export interface Category {
    Id : number
    Name : string;
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
}

export type CategoriesPaginationParams = {
    page?: number;
    limit?: number;
    name?: string;
    state?: string;
};

export interface UpdateCategoryDto {
    Name?: string;
    Description?: string;
    IsActive?: boolean;
}