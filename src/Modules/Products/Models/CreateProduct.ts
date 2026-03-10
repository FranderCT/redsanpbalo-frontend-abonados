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
  Observation?: string | null;
  Category: Category;
  Material: Material;
  UnitMeasure: Unit;
  IsActive: boolean;
  ProductSuppliers: ProductSupplier[];
  PhysicalSupplier?: PhysicalSupplier;
  LegalSupplier?: LegalSupplier;
}

export interface NewProduct {
  Name: string;
  Type: string;
  Observation?: string;
  CategoryId: number;
  MaterialId: number;
  UnitMeasureId: number;
  SuppliersIds: number[];
}

export const newProductInitialState: NewProduct = {
  Name: "",
  Type: "",
  Observation: "",
  CategoryId: 0,
  MaterialId: 0,
  UnitMeasureId: 0,
  SuppliersIds: [],
};

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

export type ProductStateFilter = "all" | "active" | "inactive";

export interface ProductPaginationParams {
  page?: number;
  limit?: number;
  q?: string;
  name?: string;
  categoryId?: number;
  materialId?: number;
  unitId?: number;
  supplierId?: number;
  state?: boolean | "true" | "false" | "1" | "0";
}

export function getProductSuppliers(product: Product): Supplier[] {
  return product.ProductSuppliers?.map((item) => item.Supplier).filter(Boolean) ?? [];
}

export function getProductSupplierNames(product: Product): string[] {
  return getProductSuppliers(product).map((supplier) => supplier.Name);
}
