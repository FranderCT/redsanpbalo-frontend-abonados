import { z } from "zod";

// =============== CREATE (Admin) ===============
export const createReportValidators = z.object({
  Location: z
    .string()
    .trim()
    .min(5, { message: "La ubicación debe tener al menos 5 caracteres" })
    .max(200, { message: "La ubicación debe tener como máximo 200 caracteres" }),

  Description: z
    .string()
    .trim()
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
    .max(1000, { message: "La descripción debe tener como máximo 1000 caracteres" }),

  LocationId: z
    .number()
    .int({ message: "Seleccione un barrio" })
    .min(1, { message: "Seleccione un barrio" }),

  ReportTypeId: z
    .number()
    .int({ message: "Seleccione un tipo de reporte" })
    .min(1, { message: "Seleccione un tipo de reporte" }),

  ReportStateId: z
    .number()
    .int({ message: "Seleccione un estado" })
    .min(1, { message: "Seleccione un estado" }),

  UserInChargeId: z
    .number()
    .int({ message: "Valor inválido" })
    .min(0, { message: "Valor inválido" }),
});

export const CreateReportSchema = createReportValidators;

export type CreateReportInput = z.infer<typeof CreateReportSchema>;

// =============== CREATE (User) ===============
export const CreateReportUserSchema = z.object({
  Location: z
    .string()
    .trim()
    .min(5, 'La ubicación debe tener al menos 5 caracteres')
    .max(200, 'Máx. 200 caracteres'),

  Description: z
    .string()
    .trim()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'Máx. 1000 caracteres'),

  LocationId: z.number().int().min(1, 'Selecciona tu barrio'),
  ReportTypeId: z.number().int().min(1, 'Seleccione tipo de reporte'),
});

export type CreateReportUserInput = z.infer<typeof CreateReportUserSchema>;

// =============== UPDATE (Edit) ===============
export const UpdateReportSchema = z.object({
  Location: z.string().max(200, 'Máx. 200 caracteres'),
  Description: z.string().max(1000, 'Máx. 1000 caracteres'),

  LocationId: z.number().int().min(0, 'Valor inválido'),
  ReportTypeId: z.number().int().min(0, 'Valor inválido'),
  ReportStateId: z.number().int().min(0, 'Valor inválido'),
  UserInChargeId: z.number().int().min(0, 'Valor inválido'),

  AdditionalInfo: z.string(),
});

export type UpdateReportInput = z.infer<typeof UpdateReportSchema>;
