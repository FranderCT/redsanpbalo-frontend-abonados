
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
