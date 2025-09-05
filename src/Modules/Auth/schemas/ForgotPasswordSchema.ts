import { z } from "zod";

export const ForgotPasswordSchema = z.object({
  IDcard: z.string()
    .min(9, "La cédula debe tener al menos 9 dígitos")
    .max(12, "Máximo 12 dígitos"),
  Email: z
    .string()
    .trim()
    .max(254, "El correo es demasiado largo")
    .email("Debe ser un correo electrónico válido"),
});