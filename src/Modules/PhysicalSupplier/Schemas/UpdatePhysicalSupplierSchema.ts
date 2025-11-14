import { z } from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

const onlyDigits = (s: string) => s.replace(/\D/g, '');
const isCedulaCR = (v: string) => /^\d{9}$/.test(onlyDigits(v));
const isDIMEX = (v: string) => {
  const d = onlyDigits(v);
  return d.length === 11 || d.length === 12;
};

export const UpdatePhysicalSupplierSchema = z.object({
  IDcard: z
    .string()
    .trim()
    .min(1, 'La identificación es obligatoria')
    .refine((v) => isCedulaCR(v) || isDIMEX(v), {
      message: 'Identificación inválida: cédula (9) o DIMEX (11–12).',
    }),

  Name: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres'),

  Surname1: z
    .string()
    .trim()
    .min(2, 'El primer apellido debe tener al menos 2 caracteres'),

  Surname2: z
    .string()
    .trim()
    .min(2, 'El segundo apellido debe tener al menos 2 caracteres'),

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