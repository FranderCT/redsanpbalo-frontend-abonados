import { z } from 'zod'
import { isValidPhoneNumber } from 'react-phone-number-input';

export const RegisterSchema = z.object({
    IDcard: z.string()
    .min(9, "La cédula debe tener al menos 9 dígitos")
    .max(12, "Máximo 12 dígitos"),

    Name: z.string().refine(val => val.length === 0 || val.length >= 2, {
    message: 'Debe tener al menos 2 caracteres si se proporciona',}),

    Surname1: z.string().refine(val => val.length === 0 || val.length >= 2, {
    message: 'Debe tener al menos 2 caracteres si se proporciona',}),

    Surname2: z.string().refine(val => val.length === 0 || val.length >= 2, {
    message: 'Debe tener al menos 2 caracteres si se proporciona',}),

    Nis: z
    .string()
    .trim()
    // Permitir vacío ("") O bien 1–10 dígitos
    .refine((v) => v === '' || /^\d{1,10}$/.test(v), {
      message: 'Debe tener máximo 10 dígitos numéricos',
    }),

    Email: z.string()
    .email('Debe ser un correo electrónico válido.')
    .max(254, 'El correo es demasiado largo'),
    
    PhoneNumber: z.string({
    required_error: 'El teléfono es obligatorio',
    invalid_type_error: 'El teléfono es obligatorio',
    }).refine((val) => isValidPhoneNumber(val), 'Número telefónico inválido'),
    
    Birthdate: z.coerce.date().refine(
      (d) => !Number.isNaN(d.getTime()),
      { message: "Fecha inválida" }
    ).refine(
      (d) => {
        const age = new Date(Date.now() - d.getTime()).getUTCFullYear() - 1970;
        return age >= 18;
      },
      { message: "Debes tener al menos 18 años" }
    ),

    Address: z.string()
    .min(10, "La dirección debe tener al menos 10 caracteres." ),

    Password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'La contraseña debe contener al menos un carácter especial'),

    ConfirmPassword: z.string(),
    IsAbonado: z.boolean(),
})
  .refine((data) => data.Password === data.ConfirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['ConfirmPassword'],
  })
  // NIS obligatorio (1–10 dígitos)
  .superRefine((data, ctx) => {
    if (data.IsAbonado) {
      if (!/^\d{1,10}$/.test(data.Nis)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El NIS es obligatorio y debe ser numérico (máx. 10 dígitos).',
          path: ['Nis'],
        });
      }
    }
  });


