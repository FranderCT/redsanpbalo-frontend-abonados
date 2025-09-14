export interface Supplier{
    Id:number;
    Name:string;
    Email:string;
    PhoneNumber:string;
    Location:string;
    IsActive:boolean;
}

export interface newSupplier{
    Name:string;
    Email:string;
    PhoneNumber:string;
    Location:string;
}

export const newSupplierInitialState: newSupplier = {
    Name:"",
    Email:"",
    PhoneNumber:"",
    Location:""
};


export interface updatSupplierDto{
    Name?: string;
    Email?: string;
    PhoneNumber?:string;
    Location?:string;
    IsActive?: boolean;
}

export const updateSupplierInitialState: updatSupplierDto = {
    Name: undefined,
    Email:undefined,
    PhoneNumber:undefined,
    Location:undefined,
    IsActive: true,

};

export interface SupplierPaginationParams {
    page: number;
    limit: number;
    Name?: string;
    Email?:string;
    PhoneNumber?:string;
    Location?:string;
    state?: string;
}