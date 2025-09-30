import { z } from "zod";

export const ResetPasswordSchema = z.object({
  NewPassword: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(64, "La contraseña no debe exceder 64 caracteres")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
    .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número")
    .regex(/[^A-Za-z0-9]/, "La contraseña debe contener al menos un carácter especial"),
  ConfirmPassword: z.string().min(1, "Debe confirmar la nueva contraseña"),
})
.refine((data) => data.NewPassword === data.ConfirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["ConfirmPassword"],
});
