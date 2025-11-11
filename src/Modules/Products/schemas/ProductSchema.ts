import { z } from "zod";

export const ProductSchema = z.object({
  Name: z.string().min(1, "El nombre debe tener al menos 2 caracteres").max(100, "Máx. 100 caracteres"),
  Type: z.string().min(1, "El tipo debe tener al menos 2 caracteres").max(60, "Máx. 60 caracteres"),
  Observation: z.string().max(500, "Máx. 500 caracteres"),

  CategoryId: z.number().int().min(0, "Valor inválido"),
  MaterialId: z.number().int().min(0, "Valor inválido"),
  UnitMeasureId: z.number().int().min(0, "Valor inválido"),
  
  // Supplier fields - uno de los dos debe tener un valor > 0 (validado en onSubmit)
  LegalSupplierId: z.number().int().min(0, "Valor inválido"),
  PhysicalSupplierId: z.number().int().min(0, "Valor inválido"),
});

export const UpdateProductSchema = z.object({
  // En edición: permitir vacío o valor válido (no requerido llenar todo)
  Name: z.string().max(100, "Máx. 100 caracteres"),
  Type: z.string().max(60, "Máx. 60 caracteres"),
  Observation: z.string().max(500, "Máx. 500 caracteres"),

  CategoryId: z.number().int(),
  MaterialId: z.number().int(),
  UnitMeasureId: z.number().int(),
  
  // Supplier fields - al menos uno debe estar presente en edición (validado en onSubmit)
  LegalSupplierId: z.number().int(),
  PhysicalSupplierId: z.number().int(),
  
  IsActive: z.boolean(),
});