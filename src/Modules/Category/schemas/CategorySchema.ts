import { z } from 'zod'

export const CategorySchema = z.object({
  Name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre no debe superar los 100 caracteres"),
  Description: z
    .string()
    .min(1, "La descripción es obligatoria")
    .max(255, "La descripción no debe superar 255 caracteres"),
});