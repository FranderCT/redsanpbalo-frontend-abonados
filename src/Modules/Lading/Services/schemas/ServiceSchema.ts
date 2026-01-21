import { z } from "zod";

export const CreateServiceSchema = z.object({
  Icon: z
    .string()
    .trim()
    .min(1, "Debe seleccionar un icono")
    .max(50, "Nombre de icono inválido"),
  Title: z
    .string()
    .trim()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(80, "Máx. 80 caracteres"),
  Description: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(255, "Máx. 255 caracteres"),
});

export const UpdateServiceSchema = z.object({
  Icon: z
    .string()
    .trim()
    .min(1, "Debe seleccionar un icono")
    .max(50, "Nombre de icono inválido"),

  Title: z
    .string()
    .trim()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(80, "Máx. 80 caracteres"),

  Description: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(255, "Máx. 255 caracteres"),

  IsActive: z.boolean({
    required_error: "El estado es obligatorio",
    invalid_type_error: "El estado debe ser verdadero o falso",
  }),
});
