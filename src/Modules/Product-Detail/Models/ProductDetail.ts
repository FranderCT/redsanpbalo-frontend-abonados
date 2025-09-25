export interface ProductDetail {
    Id: number;
    Quantity : number;
    ProductId : number;
    ProjectProjectionId : number;
}

export interface NewProductDetail {
    Quantity? : number;
    ProductId? : number;
    ProjectProjectionId? : number;
}

export const NewProductDetailInitialState : NewProductDetail = { 
    Quantity : 0,
    ProductId : 0,
    ProjectProjectionId : 0
}