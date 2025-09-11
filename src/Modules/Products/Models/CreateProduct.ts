import type { Category } from "../../Category/Models/Category";
import type { Material } from "../../Materials/Models/Material";
import type { Unit } from "../../UnitMeasure/Models/unit";

export interface Product {
  Id: number;
  Name: string;
  Type: string;
  Observation: string;
  Category: Category;
  Material: Material;
  UnitMeasure: Unit;
}


export interface NewProduct {
  Name: string;
  Type: string;
  Observation: string;
  CategoryId: number;
  MaterialId: number;
  UnitMeasureId: number;
}


export const newProductInitialState: NewProduct = {
  Name: "",
  Type: "",
  Observation: "",
  CategoryId: 0,
  MaterialId: 0,
  UnitMeasureId: 0,
};

export interface UpdateProduct{
  Name?: string;
  Type?: string;
  Observation?: string;
  CategoryId?: number;
  MaterialId?: number;
  UnitMeasureId?: number;
}

export interface ProductPaginationParams {
  page: number;
    limit: number;
    name?: string;
    categoryId?: number;
    materialId?: number;
    unitId?: number;
    state?: string;
}