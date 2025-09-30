import { z } from "zod";

export const ProductSchema = z.object({
  Name: z.string().min(1, "El nombre debe tener al menos 2 caracteres").max(100, "Máx. 100 caracteres"),
  Type: z.string().min(1, "El tipo debe tener al menos 2 caracteres").max(60, "Máx. 60 caracteres"),
  Observation: z.string(),

  CategoryId: z.number().int().min(0, "Valor inválido"),
  MaterialId: z.number().int().min(0, "Valor inválido"),
  UnitMeasureId: z.number().int().min(0, "Valor inválido"),
});

export const UpdateProductSchema = z.object({
  Name: z.string().max(100, "Máx. 100 caracteres").optional(),
  Type: z.string().max(60, "Máx. 60 caracteres").optional(),
  Observation: z.string().optional(),

  CategoryId: z.number().int().min(0, "Valor inválido").optional(),
  MaterialId: z.number().int().min(0, "Valor inválido").optional(),
  UnitMeasureId: z.number().int().min(0, "Valor inválido").optional(),
  IsActive: z.boolean(),
});