import { z } from "zod";

export const ProductSchema = z.object({
  Name: z.string().trim().min(1, "El nombre es obligatorio").max(100, "Máx. 100 caracteres"),
  Type: z.string().trim().min(1, "El tipo es obligatorio").max(60, "Máx. 60 caracteres"),
  Observation: z.string().trim().max(500, "Máx. 500 caracteres"),
  CategoryId: z.number().int().min(1, "Selecciona una categoría"),
  MaterialId: z.number().int().min(1, "Selecciona un material"),
  UnitMeasureId: z.number().int().min(1, "Selecciona una unidad"),
});

export const UpdateProductSchema = z.object({
  Name: z.string().trim().min(1, "El nombre es obligatorio").max(100, "Máx. 100 caracteres"),
  Type: z.string().trim().min(1, "El tipo es obligatorio").max(60, "Máx. 60 caracteres"),
  Observation: z.string().trim().max(500, "Máx. 500 caracteres"),
  CategoryId: z.number().int().min(1, "Selecciona una categoría"),
  MaterialId: z.number().int().min(1, "Selecciona un material"),
  UnitMeasureId: z.number().int().min(1, "Selecciona una unidad"),
  IsActive: z.boolean(),
});
