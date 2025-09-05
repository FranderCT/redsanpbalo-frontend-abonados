import { z } from 'zod'

export const AuthSchema = z.object({
    Email: z.string()
    .nonempty('El correo es obligatorio.')
    .email('Debe ser un correo electrónico válido.')
    .max(254, 'El correo es demasiado largo'),
    
    Password: z.string()
    .nonempty('La contraseña es obligatoria.')
    .max(64, 'Máximo 64 caracteres')
})

