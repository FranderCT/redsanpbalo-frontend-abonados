import { z } from 'zod'

export const AuthSchema = z.object({
    email: z.string()
    .nonempty('El correo es obligatorio.')
    .email('Debe ser un correo electrónico válido.')
    .max(254, 'El correo es demasiado largo'),
    
    password: z.string()
    .nonempty('La contraseña es obligatoria.')
    .max(64, 'Máximo 64 caracteres')
})

