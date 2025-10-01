import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

// Helpers locales (mismos criterios en todo el schema)
const onlyDigits = (s: string) => s.replace(/\D/g, "");
const upperNoSpaces = (s: string) => s.toUpperCase().trim();

const isCedulaCR = (v: string) => /^\d{9}$/.test(onlyDigits(v));             // 9 dígitos
const isDIMEX    = (v: string) => {
  const d = onlyDigits(v);
  return d.length === 11 || d.length === 12;                                  // 11–12 dígitos
};
const isPassport = (v: string) => /^[A-Z0-9]{6,20}$/i.test(upperNoSpaces(v)); // 6–20 alfanum

export const PhysicalSupplierSchema = z
  .object({
    IDcard: z
      .string()
      .trim()
      .min(1, "La identificación es obligatoria")
      .refine((v) => isCedulaCR(v) || isDIMEX(v) || isPassport(v), {
        message:
          "Identificación inválida: use cédula (9 dígitos), DIMEX (11–12 dígitos) o pasaporte (6–20 alfanuméricos).",
      }),

    Name: z.string().refine(val => val.length === 0 || val.length >= 2, {
    message: 'Debe tener al menos 2 caracteres si se proporciona',}),

    Email: z
      .string()
      .trim()
      .email("Debe ser un correo electrónico válido.")
      .max(254, "El correo es demasiado largo"),

    PhoneNumber: z
      .string({
        required_error: "El teléfono es obligatorio",
        invalid_type_error: "El teléfono es obligatorio",
      })
      .refine((val) => isValidPhoneNumber(val), "Número telefónico inválido"),

    Location: z
      .string()
      .trim()
      .min(10, "La dirección debe tener al menos 10 caracteres."),
  })

  .superRefine((data, ctx) => {
    // Si es pasaporte/DIMEX, reforzamos que el nombre tenga sentido (ya está requerido, pero dejamos ejemplo)
    if ((isPassport(data.IDcard) || isDIMEX(data.IDcard)) && data.Name.trim().length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Para documento extranjero, ingrese el nombre completo (≥ 3 caracteres).",
        path: ["Name"],
      });
    }
  });

// Tipo inferido para TS
export type CreatePhysicalSupplierInput = z.infer<typeof PhysicalSupplierSchema>;
