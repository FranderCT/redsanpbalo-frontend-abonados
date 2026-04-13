import { z } from "zod";

export const createReportTypeValidators = z.object({
  Name: z
    .string()
    .trim()
    .min(3, { message: "El tipo de reporte debe tener al menos 3 caracteres" })
    .max(50, { message: "El tipo de reporte debe tener como máximo 50 caracteres" }),
});

export const updateReportTypeValidators = z.object({
  Name: z
    .string()
    .trim()
    .min(3, { message: "El tipo de reporte debe tener al menos 3 caracteres" })
    .max(50, { message: "El tipo de reporte debe tener como máximo 50 caracteres" }),
  IsActive: z.boolean(),
});
