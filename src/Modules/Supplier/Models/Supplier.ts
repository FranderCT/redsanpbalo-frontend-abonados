export interface Supplier{
    Id:number;
    Name:string;
    IsActive:boolean;
}

export interface newSupplier{
    Name:string;
}

export const newSupplierInitialState: newSupplier = {
    Name:"",
};


export interface updatSupplierDto{
    Name?: string;
    IsActive?: boolean;
}

export const updateSupplierInitialState: updatSupplierDto = {
    Name: undefined,
    IsActive: true,
};

export interface SupplierPaginationParams {
    page: number;
    limit: number;
    name?: string;
    state?: string;
}