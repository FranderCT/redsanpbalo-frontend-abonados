import { z } from "zod";

export const ProjectTraceSchema = z.object({
  Name: z
    .string()
    .trim()
    .min(1, "El nombre del seguimiento es requerido")
    .max(255, "El nombre del seguimiento no puede superar los 255 caracteres"),
  Observation: z
    .string()
    .trim()
    .min(1, "La observación del seguimiento es requerida")
    .max(2000, "La observación del seguimiento no puede superar los 2000 caracteres"),
  ProjectId: z
    .number({
      required_error: "El proyecto es requerido",
      invalid_type_error: "El proyecto debe ser un número válido",
    })
    .int("El proyecto debe ser un número entero")
    .positive("El proyecto debe ser válido"),
});

export type ProjectTraceFormValues = z.infer<typeof ProjectTraceSchema>;
