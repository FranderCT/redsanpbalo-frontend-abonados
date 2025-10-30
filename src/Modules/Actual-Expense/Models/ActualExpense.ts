import type { Product } from "../../Products/Models/CreateProduct";

export interface ProductDetail {
    Id: number;
    Quantity: number;
    Product: Product;
}

export interface ActualExpense {
    Id: number;
    date: string;
    Observation: string;
    IsActive: boolean;
    ProductDetails: ProductDetail[];
}

export interface NewActualExpense {
    Observation?: string;
    TraceProjectId?: number;   
}