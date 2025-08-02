import { z } from 'zod'

export const RegisterSchema = z.object({
    nombre: z.string()
    .min(2, "Debe tener al menos 2 caracteres"),

    apellidos: z.string()
    .min(2, "Debe tener al menos 2 caracteres"),

    cedula: z.string()
    .min(9, "La cédula debe tener al menos 9 dígitos")
    .max(12, "Máximo 12 dígitos"),

    nis: z.string()
    .max(600, "Debe tener maximo 60 caracteres")
    .regex(/^\d{10}$/, "Solo números"),

    email: z.string()
    .email('Debe ser un correo electrónico válido.')
    .max(254, 'El correo es demasiado largo'),
    
    telefono: z.string()
    .regex(/^[678]\d{7}$/, "Teléfono inválido. Debe tener 8 dígitos y empezar en 6, 7 u 8"),
    
    fechaNacimiento: z.string()
        .refine((val) => {
        const birth = new Date(val)
        const age = new Date(Date.now() - birth.getTime()).getUTCFullYear() - 1970
        return age >= 18
    }, {
        message: "Debes tener al menos 18 años"
    }),

    Password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'La contraseña debe contener al menos un carácter especial'),

    confirmPassword: z.string()
    })
    .refine(data => data.Password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
})
