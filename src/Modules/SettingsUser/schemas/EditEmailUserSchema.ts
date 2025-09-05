import { z } from 'zod'

export const EditEmailUserSchema = z.object({
    
    OldEmail: z.string()
    .email('Debe ser un correo electrónico válido.')
    .max(254, 'El correo es demasiado largo'),

    NewEmail: z.string()
    .email('Debe ser un correo electrónico válido.')
    .max(254, 'El correo es demasiado largo'),
    }).refine((data) => data.OldEmail !== data.NewEmail, {
    message: 'El correo antiguo y el nuevo no pueden ser iguales',
    path: ['NewEmail'],

});


