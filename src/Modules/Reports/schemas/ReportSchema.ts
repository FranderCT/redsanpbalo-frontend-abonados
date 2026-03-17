import { z } from "zod";

export const createReportValidators = z.object({
  ExactLocation: z
    .string()
    .trim()
    .min(5, { message: "La ubicacion debe tener al menos 5 caracteres" })
    .max(200, { message: "La ubicacion debe tener como maximo 200 caracteres" }),
  Description: z
    .string()
    .trim()
    .min(10, { message: "La descripcion debe tener al menos 10 caracteres" })
    .max(1000, { message: "La descripcion debe tener como maximo 1000 caracteres" }),
  ReportLocationId: z
    .number()
    .int({})
    .min(1, { message: "Seleccione un barrio" }),
  ReportTypeId: z
    .number()
    .int({})
    .min(1, { message: "Seleccione un tipo de reporte" }),
});

export const CreateReportSchema = createReportValidators;
export type CreateReportInput = z.infer<typeof CreateReportSchema>;

export const createReportUserValidators = z.object({
  ExactLocation: z
    .string()
    .trim()
    .min(5, { message: "La ubicacion debe tener al menos 5 caracteres" })
    .max(200, { message: "La ubicacion debe tener como maximo 200 caracteres" }),
  Description: z
    .string()
    .trim()
    .min(10, { message: "La descripcion debe tener al menos 10 caracteres" })
    .max(1000, { message: "La descripcion debe tener como maximo 1000 caracteres" }),
  ReportLocationId: z
    .number()
    .int({})
    .min(1, { message: "Selecciona tu barrio" }),
  ReportTypeId: z
    .number()
    .int({})
    .min(1, { message: "Seleccione tipo de reporte" }),
});

export const CreateReportUserSchema = createReportUserValidators;
export type CreateReportUserInput = z.infer<typeof CreateReportUserSchema>;

export const updateReportValidators = z.object({
  ExactLocation: z
    .string()
    .max(200, { message: "La ubicacion debe tener como maximo 200 caracteres" }),
  Description: z
    .string()
    .max(1000, { message: "La descripcion debe tener como maximo 1000 caracteres" }),
  ReportLocationId: z
    .number()
    .int({})
    .min(0, { message: "Valor invalido" }),
  ReportTypeId: z
    .number()
    .int({})
    .min(0, { message: "Valor invalido" }),
  ReportState: z.enum(["Pendiente", "En Proceso", "Resuelto"]),
  PlumberUserId: z
    .number()
    .int({})
    .min(0, { message: "Valor invalido" }),
});

export const UpdateReportSchema = updateReportValidators;
export type UpdateReportInput = z.infer<typeof UpdateReportSchema>;
