import { z } from 'zod'

export const UnitMeasureSchemas = z.object({
    Name: z.string()
    .nonempty('El nombre es obligatorio.')
    .max(30, 'El nombre es demasiado largo'),
})

export const UpdateUnitMeasureSchemas = z.object({
    Name: z.string()
    .max(30, 'El nombre es demasiado largo'),
})

