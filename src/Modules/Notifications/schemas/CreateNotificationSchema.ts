import { z } from "zod";
import { ALL_ROLES_OPTION_NAME } from "../Types/Notification";

export const createNotificationValidators = z.object({
  subject: z
    .string()
    .trim()
    .min(3, { message: "El asunto debe tener al menos 3 caracteres" })
    .max(100, { message: "El asunto debe tener como maximo 100 caracteres" }),
  description: z
    .string()
    .trim()
    .min(10, { message: "La descripcion debe tener al menos 10 caracteres" })
    .max(500, { message: "La descripcion debe tener como maximo 500 caracteres" }),
  userRole: z
    .string({ message: "Debe seleccionar un rol" })
    .trim()
    .refine((value) => value.length > 0 || value === ALL_ROLES_OPTION_NAME, {
      message: "Debe seleccionar un rol",
    }),
});
