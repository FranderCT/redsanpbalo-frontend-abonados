import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";


export const AgentSupplierSchema = z.object({
  Id: z.number().optional(),
  Name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no debe superar los 50 caracteres"),
  Surname1: z
    .string()
    .min(2, "El primer apellido debe tener al menos 2 caracteres")
    .max(50, "El primer apellido no debe superar los 50 caracteres")
    .optional(),
  Surname2: z
    .string()
    .min(2, "El segundo apellido debe tener al menos 2 caracteres")
    .max(50, "El segundo apellido no debe superar los 50 caracteres")
    .optional(),
  Email: z
    .string()
    .email("Debe ser un correo válido")
    .optional()
    .or(z.literal("")), // permite vacío
  PhoneNumber: z.string({
    required_error: 'El teléfono es obligatorio',
    invalid_type_error: 'El teléfono es obligatorio',
    }).refine((val) => isValidPhoneNumber(val), 'Número telefónico inválido'), // permite vacío
  SupplierId: z
    .number()
    .min(1, "Debe seleccionar un proveedor válido"),
});
