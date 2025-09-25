import type { ProductDetail } from "../../../Product-Detail/Models/ProductDetail";

export interface ProjectProjection { 
    Id : number;
    Observation : string;
    ProductDetails : ProductDetail[]
}


export interface NewProjectProjection {
    Observation : string;
    ProjectId : number;
}


export const NewProjectProjectionInitialState : NewProjectProjection = {
    Observation : '',
    ProjectId : 0
}