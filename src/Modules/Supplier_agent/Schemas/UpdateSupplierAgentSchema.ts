import { z } from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

export const UpdateAgentSupplierSchema = z.object({
    Email: z
    .string()
    .email('Debe ser un correo electrónico válido.')
    .max(254, 'El correo es demasiado largo'),

  PhoneNumber: z
    .string()
    .refine((val) => isValidPhoneNumber(val), 'Número telefónico inválido'),

 IsActive: z.boolean(),
})