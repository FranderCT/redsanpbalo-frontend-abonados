import { z } from "zod";
import { ALL_ROLES_OPTION_ID } from "../Types/Notification";

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
  targetRoleId: z
    .number({ message: "Debe seleccionar un rol" })
    .int()
    .refine((value) => value > 0 || value === ALL_ROLES_OPTION_ID, {
      message: "Debe seleccionar un rol",
    }),
});
