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
  }),

  // Paso 1: detalles
  ProjectBase.pick({
    Objective: true,
    Description: true,
    Observation: true,
    SpaceOfDocument: true,
    ProjectStateId: true,
  }),

  // Paso 2: proyección + detalles
  z.object({
    projection: ProjectBase.shape.projection,      // reutiliza sub-esquemas
    productDetails: ProjectBase.shape.productDetails,
  }),

  // Paso 3: confirmación (sin validación adicional)
  z.any(),
] as const;
