import { z } from 'zod'

export const RegisterSchema = z.object({
    Idcard: z.string()
    .min(9, "La cédula debe tener al menos 9 dígitos")
    .max(12, "Máximo 12 dígitos"),

    Name: z.string().refine(val => val.length === 0 || val.length >= 2, {
    message: 'Debe tener al menos 2 caracteres si se proporciona',}),

    Surname1: z.string().refine(val => val.length === 0 || val.length >= 2, {
    message: 'Debe tener al menos 2 caracteres si se proporciona',}),

    Surname2: z.string().refine(val => val.length === 0 || val.length >= 2, {
    message: 'Debe tener al menos 2 caracteres si se proporciona',}),

    Nis: z.string()
    .min(1, "El NIS es requerido")
    .max(10, "Debe tener máximo 10 dígitos")
    .regex(/^\d+$/, "Solo se permiten números"),

    Email: z.string()
    .email('Debe ser un correo electrónico válido.')
    .max(254, 'El correo es demasiado largo'),
    
    PhoneNumber: z.string()
    .regex(/^[678]\d{7}$/, "Teléfono inválido. Debe tener 8 dígitos y empezar en 6, 7 u 8"),
    
    BirthDate: z.coerce.date().refine((val) => {
    const age = new Date(Date.now() - val.getTime()).getUTCFullYear() - 1970;
    return age >= 18;
    }, {
        message: "Debes tener al menos 18 años"
    }),

    Address: z.string()
    .min(10, "La dirección debe tener al menos 10 caracteres." )
    .max(120, "La dirección no puede superar 120 caracteres."),

    Password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'La contraseña debe contener al menos un carácter especial'),

    ConfirmPassword: z.string()
    })
    .refine(data => data.Password === data.ConfirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
})

