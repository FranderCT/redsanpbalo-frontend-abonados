import { z } from 'zod'
import { isValidPhoneNumber } from 'react-phone-number-input';
import { TypeDNI } from '../../Auth/Models/RegisterUser';

export const AddUserSchema = z.object({
    TypeDNI: z.nativeEnum(TypeDNI),

    IDcard: z.string().min(1, 'El número de identificación es requerido'),

    Name: z.string(),

    Surname1: z.string(),

    Surname2: z.string().refine(val => val.length === 0 || val.length >= 2, {
      message: 'Debe tener al menos 2 caracteres si se proporciona',
    }),

    IsAbonado: z.boolean(),
    Nis: z.array(z.number().positive('Cada NIS debe ser un número positivo')),

    Email: z.string()
      .email('Debe ser un correo electrónico válido.')
      .max(254, 'El correo es demasiado largo'),

    PhoneNumber: z.string({
      required_error: 'El teléfono es obligatorio',
      invalid_type_error: 'El teléfono es obligatorio',
    }).refine((val) => isValidPhoneNumber(val), 'Número telefónico inválido'),

    Birthdate: z.coerce.date({
      errorMap: () => ({ message: 'Fecha inválida' }),
    }).refine(
      (d) => !Number.isNaN(d.getTime()),
      { message: 'Fecha inválida' }
    ).refine(
      (d) => {
        const age = new Date(Date.now() - d.getTime()).getUTCFullYear() - 1970;
        return age >= 18;
      },
      { message: 'Debes tener al menos 18 años' }
    ),

    Address: z.string()
      .min(10, 'La dirección debe tener al menos 10 caracteres.')
      .max(255, 'La dirección no puede superar 255 caracteres.'),

    roleIds: z.array(z.number())
      .min(1, 'Debe asignar al menos un rol al usuario'),
})
.superRefine((data, ctx) => {
  // Validación condicional de IDcard según TypeDNI
  if (data.TypeDNI === TypeDNI.Cedula) {
    if (!/^\d{9,12}$/.test(data.IDcard)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La cédula debe tener entre 9 y 12 dígitos numéricos',
        path: ['IDcard'],
      });
    }
  } else {
    if (data.IDcard.length < 5 || data.IDcard.length > 20) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El número de identificación debe tener entre 5 y 20 caracteres',
        path: ['IDcard'],
      });
    }
  }

  // Nombre y primer apellido requeridos cuando no es Cédula
  if (data.TypeDNI !== TypeDNI.Cedula) {
    if (data.Name.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El nombre es requerido (mínimo 2 caracteres)',
        path: ['Name'],
      });
    }
    if (data.Surname1.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El primer apellido es requerido (mínimo 2 caracteres)',
        path: ['Surname1'],
      });
    }
  } else {
    // Para cédula son opcionales pero si se dan deben tener >= 2 chars
    if (data.Name.length > 0 && data.Name.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Debe tener al menos 2 caracteres si se proporciona',
        path: ['Name'],
      });
    }
    if (data.Surname1.length > 0 && data.Surname1.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Debe tener al menos 2 caracteres si se proporciona',
        path: ['Surname1'],
      });
    }
  }

  // NIS requerido si es abonado
  if (data.IsAbonado && data.Nis.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Si es abonado, debe tener al menos un NIS',
      path: ['Nis'],
    });
  }
});
