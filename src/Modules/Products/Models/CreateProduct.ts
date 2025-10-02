import type { Category } from "../../Category/Models/Category";
import type { Material } from "../../Materials/Models/Material";
import type { Supplier } from "../../Supplier/Models/Supplier";
import type { Unit } from "../../UnitMeasure/Models/unit";

export interface Product {
  Id: number;
  Name: string;
  Type: string;
  Observation: string;
  Category: Category;
  Material: Material;
  UnitMeasure: Unit;
  Supplier: Supplier;
  IsActive: boolean;  // Añadir IsActive
}


export interface NewProduct {
  Name?: string;
  Type?: string;
  Observation?: string;
  CategoryId?: number;
  MaterialId?: number;
  UnitMeasureId?: number;
  LegalSupplierId?: number;  
  PhysicalSupplierId?: number
}


export interface UpdateProduct {
  Name?: string;
  Type?: string;
  Observation?: string;
  CategoryId?: number;
  MaterialId?: number;
  UnitMeasureId?: number;
  SupplierId?: number;
  IsActive?: boolean;  // Puede ser opcional
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