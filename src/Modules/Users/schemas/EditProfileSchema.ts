import { z } from 'zod'
import { isValidPhoneNumber } from 'react-phone-number-input';

export const EditProfileSchema = z.object({
  // En edición: permitir vacío ("") o no enviar el campo. Si viene valor, debe ser válido.
  PhoneNumber: z
    .string()
    // En edición permitimos vacío ("") o un número válido
    .refine((val) => val === '' || isValidPhoneNumber(val), 'Número telefónico inválido'),

  Birthdate: z
    .coerce
    .date()
    .refine((val) => {
      const age = new Date(Date.now() - val.getTime()).getUTCFullYear() - 1970;
      return age >= 18;
    }, {
      message: 'Debes tener al menos 18 años',
    })
    .optional(),

  // Permitir vacío o no enviar. Si se ingresa algo, mínimo 10 y máximo 120.
  Address: z
    .string()
    .trim()
    .max(400, 'La dirección no puede superar 400 caracteres.')
    // Permitir vacío o mínimo 10 caracteres si se escribe algo
    .refine((val) => val.length === 0 || val.length >= 10, {
      message: 'La dirección debe tener al menos 10 caracteres.',
    }),

  // Permitir vacío ("") o 1–10 dígitos
  Nis: z
    .string()
    .trim()
    .refine((v) => v === '' || /^\d{1,10}$/.test(v), {
      message: 'Debe tener máximo 10 dígitos numéricos',
    }),

  // Campos del formulario con validación simple
  roleIds: z.array(z.number()),
  IsActive: z.boolean(),
});


