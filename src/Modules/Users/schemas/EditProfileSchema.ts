import { z } from 'zod'
import { isValidPhoneNumber } from 'react-phone-number-input';

const emptyToUndef = (v: unknown) =>
  v === "" || v === null ? undefined : v;

export const EditProfileSchema = z.object({
    
    PhoneNumber: z.string({
    required_error: 'El teléfono es obligatorio',
    invalid_type_error: 'El teléfono es obligatorio',
    }).refine((val) => isValidPhoneNumber(val), 'Número telefónico inválido'),
    
    Birthdate: z.coerce.date().refine((val) => {
    const age = new Date(Date.now() - val.getTime()).getUTCFullYear() - 1970;
    return age >= 18;
    }, {
        message: "Debes tener al menos 18 años"
    })
    .optional(),

    Address: z.string()
    .min(10, "La dirección debe tener al menos 10 caracteres." )
    .max(120, "La dirección no puede superar 120 caracteres.")
    .optional(),

});


