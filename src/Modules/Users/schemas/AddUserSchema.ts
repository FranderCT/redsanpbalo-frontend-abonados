import { z } from 'zod'
import { isValidPhoneNumber } from 'react-phone-number-input';

export const AddUserSchema = z.object({
    IDcard: z.string()
    .min(9, "La cédula debe tener al menos 9 dígitos")
    .max(12, "Máximo 12 dígitos"),

    Name: z.string().refine(val => val.length === 0 || val.length >= 2, {
    message: 'Debe tener al menos 2 caracteres si se proporciona',}),

    Surname1: z.string().refine(val => val.length === 0 || val.length >= 2, {
    message: 'Debe tener al menos 2 caracteres si se proporciona',}),

    Surname2: z.string().refine(val => val.length === 0 || val.length >= 2, {
    message: 'Debe tener al menos 2 caracteres si se proporciona',}),
    
    IsAbonado: z.boolean(),
    Nis: z.array(z.number().positive('Cada NIS debe ser un número positivo')),

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
    .min(10, "La dirección debe tener al menos 10 caracteres." )
    .max(400, "La dirección no puede superar 400 caracteres."),

    roleIds: z.array(z.number())
    .min(1, "Debe asignar al menos un rol al usuario"),
})
.refine((data) => {
  // Si es abonado, debe tener al menos un NIS
  if (data.IsAbonado) {
    return data.Nis.length > 0;
  }
  return true; // Si no es abonado, Nis puede estar vacío
}, {
  message: "Si es abonado, debe tener al menos un NIS",
  path: ["Nis"]
})