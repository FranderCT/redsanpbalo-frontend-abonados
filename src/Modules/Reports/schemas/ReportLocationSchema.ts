import { z } from "zod";

export const createReportLocationValidators = z.object({
  Neighborhood: z
    .string()
    .trim()
    .min(3, { message: "El barrio debe tener al menos 3 caracteres" })
    .max(50, { message: "El barrio debe tener como máximo 50 caracteres" }),
});

export const updateReportLocationValidators = z.object({
  Neighborhood: z
    .string()
    .trim()
    .min(3, { message: "El barrio debe tener al menos 3 caracteres" })
    .max(50, { message: "El barrio debe tener como máximo 50 caracteres" }),
  IsActive: z.boolean(),
});
