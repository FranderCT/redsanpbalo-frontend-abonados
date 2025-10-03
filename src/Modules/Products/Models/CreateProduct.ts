import type { Category } from "../../Category/Models/Category";
import type { LegalSupplier } from "../../LegalSupplier/Models/LegalSupplier";
import type { Material } from "../../Materials/Models/Material";
import type { PhysicalSupplier } from "../../PhysicalSupplier/Models/PhysicalSupplier";

import type { Unit } from "../../UnitMeasure/Models/unit";

export interface Product {
  Id: number;
  Name: string;
  Type: string;
  Observation: string;
  Category: Category;
  Material: Material;
  UnitMeasure: Unit;
  IsActive: boolean;  // Añadir IsActive
  PhysicalSupplier: PhysicalSupplier
  LegalSupplier : LegalSupplier
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