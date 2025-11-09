// Modules/Project/schemas/StepSchema.ts
import { z } from "zod";
import { ProjectBase } from "./ProjectSchema";

export const StepSchemas = [
  // Paso 0: básicos
  ProjectBase.pick({
    Name: true,
    Location: true,
    InnitialDate: true,
    EndDate: true,
  }).superRefine((val, ctx) => {
    // Validar fechas en el paso 0 también
    if (val.EndDate.getTime() < val.InnitialDate.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["EndDate"],
        message: "La fecha de fin debe ser mayor o igual a la fecha de inicio.",
      });
    }
  }),

  // Paso 1: detalles
  ProjectBase.pick({
    Objective: true,
    Description: true,
    Observation: true,
    ProjectStateId: true,
    UserId: true, // ← AGREGADO
  }),

  // Paso 2: proyección + detalles
  z.object({
    projection: ProjectBase.shape.projection,
    productDetails: ProjectBase.shape.productDetails,
  }),

  // Paso 3: documentos (opcional)
  z.object({
    files: z.array(z.any()).optional(),
    subfolder: z.string().optional(),
  }),

  // Paso 4: confirmación (sin validación adicional)
  z.any(),
] as const;