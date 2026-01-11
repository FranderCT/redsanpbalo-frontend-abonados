import { z } from "zod";

export const CreateFAQSchema = z.object({
  Question: z
    .string()
    .trim()
    .min(5, "La pregunta debe tener al menos 5 caracteres")
    .max(200, "Máx. 200 caracteres"),
  Answer: z
    .string()
    .trim()
    .min(10, "La respuesta debe tener al menos 10 caracteres")
    .max(2000, "Máx. 2000 caracteres"),
});

export const UpdateFAQSchema = z.object({
  Question: z
    .string()
    .trim()
    .min(5, "La pregunta debe tener al menos 5 caracteres")
    .max(200, "Máx. 200 caracteres"),
  Answer: z
    .string()
    .trim()
    .min(10, "La respuesta debe tener al menos 10 caracteres")
    .max(2000, "Máx. 2000 caracteres"),
  IsActive: z.boolean(),
});
