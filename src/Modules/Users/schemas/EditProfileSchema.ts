import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export const EditProfileSchema = z.object({
  PhoneNumber: z
    .string()
    .refine((v) => v === "" || isValidPhoneNumber(v), "Número telefónico inválido")
    .optional(),

  Birthdate: z
    .coerce
    .date()
    .refine((val) => {
      const age = new Date(Date.now() - val.getTime()).getUTCFullYear() - 1970;
      return age >= 18;
    }, { message: "Debes tener al menos 18 años" })
    .optional(),

  Address: z
    .string()
    .trim()
    .max(400, "La dirección no puede superar 400 caracteres.")
    .refine((v) => v.length === 0 || v.length >= 10, {
      message: "La dirección debe tener al menos 10 caracteres.",
    })
    .optional(),
});

export type EditProfileInput = z.infer<typeof EditProfileSchema>;
