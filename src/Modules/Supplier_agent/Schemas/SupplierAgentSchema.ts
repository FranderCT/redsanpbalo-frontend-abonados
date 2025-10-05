// SupplierAgentSchema.ts
import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export const SupplierAgentSchema = z.object({
  IDcard: z
    .string()
    .min(9, "La cédula debe tener al menos 9 dígitos")
    .max(12, "Máximo 12 dígitos"),

    Name: z.string().refine(val => val.length === 0 || val.length >= 2, {
    message: 'Debe tener al menos 2 caracteres si se proporciona',}),

    Surname1: z.string().refine(val => val.length === 0 || val.length >= 2, {
    message: 'Debe tener al menos 2 caracteres si se proporciona',}),

    Surname2: z.string().refine(val => val.length === 0 || val.length >= 2, {
    message: 'Debe tener al menos 2 caracteres si se proporciona',}),

  Email: z
    .string()
    .email("Debe ser un correo electrónico válido")
    .max(254, "El correo es demasiado largo"),

  PhoneNumber: z
    .string()
    .refine((val) => isValidPhoneNumber(val), "Número telefónico inválido"),

  LegalSupplierId: z.number(), // 👈 agregado, evita el TS2322
});

export type CreateSupplierAgentInput = z.infer<typeof SupplierAgentSchema>;
