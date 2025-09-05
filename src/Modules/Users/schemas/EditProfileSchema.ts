import { z } from 'zod'

const emptyToUndef = (v: unknown) =>
  v === "" || v === null ? undefined : v;

export const EditProfileSchema = z.object({
    
    PhoneNumber: z.string()
    .regex(/^[678]\d{7}$/, "Teléfono inválido. Debe tener 8 dígitos y empezar en 6, 7 u 8")
    .optional(),
    
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


