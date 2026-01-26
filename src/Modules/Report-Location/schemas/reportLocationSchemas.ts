import z from 'zod';

export const reportLocatioSchema = z.object({
    Neighborhood: z.string().min(1, 'Neighborhood is required'),
})