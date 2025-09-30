import type { Product } from "../../Products/Models/CreateProduct";
import type { ProjectProjection } from "../../Project/Project-projection/Models/ProjectProjection";

export interface ProductDetail {
    Id: number;
    Quantity : number;
    Product : Product;
    ProjectProjection : ProjectProjection;
    // agregar actual expense 
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