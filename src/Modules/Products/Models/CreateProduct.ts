import type { Category } from "../../Category/Models/Category";
import type { LegalSupplier } from "../../LegalSupplier/Models/LegalSupplier";
import type { Material } from "../../Materials/Models/Material";
import type { PhysicalSupplier } from "../../PhysicalSupplier/Models/PhysicalSupplier";
import type { Supplier } from "../../Supplier/Models/Supplier";
import type { Unit } from "../../UnitMeasure/Models/unit";

export interface ProductSupplier {
  Id: number;
  Supplier: Supplier;
}

export interface Product {
  Id: number;
  Name: string;
  Type: string;
  Observation: string;
  Category: Category;
  Material: Material;
  UnitMeasure: Unit;
  IsActive: boolean;
  ProductSuppliers: ProductSupplier[];
  // Campos legacy (opcionales para compatibilidad)
  PhysicalSupplier?: PhysicalSupplier;
  LegalSupplier?: LegalSupplier;
}


export interface NewProduct {
  Name: string;
  Type: string;
  Observation: string;
  CategoryId: number;
  MaterialId: number;
  UnitMeasureId: number;
  SuppliersIds: number[];
}


export interface UpdateProduct {
  Name?: string;
  Type?: string;
  Observation?: string;
  CategoryId?: number;
  MaterialId?: number;
  UnitMeasureId?: number;
  SuppliersIds?: number[];
  IsActive?: boolean;
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