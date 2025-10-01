// src/Modules/LegalSupplier/schemas/LegalSupplierSchema.ts
import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

const onlyDigits = (s: string) => s.replace(/\D/g, "");
const isLegalIdCR = (v: string) => {
  const d = onlyDigits(v);
  return d.length === 10 && /^[34]/.test(d);
};

export const LegalSupplierSchema = z
  .object({
    LegalID: z
      .string()
      .trim()
      .min(1, "La cédula jurídica es obligatoria")
      .refine((v) => onlyDigits(v).length === 10, {
        message: "La cédula debe tener 10 dígitos (puede escribir con guiones).",
      })
      .refine((v) => isLegalIdCR(v), {
        message: "Cédula jurídica inválida: 10 dígitos y debe iniciar con 3 o 4.",
      }),

    CompanyName: z.string().refine(val => val.length === 0 || val.length >= 2, {
    message: 'Debe tener al menos 2 caracteres si se proporciona',}),

    Email: z
      .string()
      .trim()
      .email("Debe ser un correo electrónico válido.")
      .max(254, "El correo es demasiado largo"),

    PhoneNumber: z
      .string({ required_error: "El teléfono es obligatorio", invalid_type_error: "El teléfono es obligatorio" })
      .refine((val) => isValidPhoneNumber(val), "Número telefónico inválido"),

    Location: z
      .string()
      .trim()
      .min(10, "La dirección debe tener al menos 10 caracteres."),

    // 🔧 string SIEMPRE (vacío permitido) para que case con defaultValues: ""
    WebSite: z
      .string()
      .trim()
      .refine(
        (v) => v === "" || /^https?:\/\/[^\s]+$/i.test(v) || /^[^\s]+\.[^\s]+$/i.test(v),
        "Sitio web inválido"
      ),
  })
  .superRefine((data, ctx) => {
    if (!isLegalIdCR(data.LegalID)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La cédula jurídica debe tener 10 dígitos y empezar con 3 o 4.",
        path: ["LegalID"],
      });
    }
  });

export type CreateLegalSupplierInput = z.infer<typeof LegalSupplierSchema>;

// (Opcional) normalizador antes de enviar al backend
export function normalizeCreateLegalSupplier(input: CreateLegalSupplierInput) {
  return {
    ...input,
    LegalID: onlyDigits(input.LegalID),
  };
}
