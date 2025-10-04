import { z } from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

export const UpdatePhysicalSupplierSchema = z.object({
    Email: z
    .string()
    .email('Debe ser un correo electrónico válido.')
    .max(254, 'El correo es demasiado largo'),

  PhoneNumber: z
    .string()
    .refine((val) => isValidPhoneNumber(val), 'Número telefónico inválido'),

  Location: z
    .string()
    .min(10, 'La dirección debe tener al menos 10 caracteres.'),

 IsActive: z.boolean(),
})