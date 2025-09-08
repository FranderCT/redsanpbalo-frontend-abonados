import { z } from 'zod'

export const MaterialSchema = z.object({
  Name: z
    .string()
    .min(1, { message: "El nombre es obligatorio" })
    .max(100, { message: "El nombre no puede superar los 100 caracteres" }),
 IsActive: z.boolean(),
});


  
