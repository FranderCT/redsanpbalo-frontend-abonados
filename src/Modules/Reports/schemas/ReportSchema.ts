import { z } from "zod";
import { ReportStateEnum, ReportUrgencyEnum } from "../Models/ReportEnums";

const stateEnum = z.enum([
  ReportStateEnum.Pendiente,
  ReportStateEnum.EnProgreso,
  ReportStateEnum.Cancelado,
  ReportStateEnum.Resuelto,
]);

const urgencyEnum = z.enum([
  ReportUrgencyEnum.Baja,
  ReportUrgencyEnum.Media,
  ReportUrgencyEnum.Alta,
  ReportUrgencyEnum.Critica,
]);

// =============== CREATE (Admin) ===============
export const createReportValidators = z.object({
  ExactLocation: z
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
    .int()
    .min(1, { message: "Seleccione un barrio" }),

  ReportTypeId: z
    .number()
    .int()
    .min(1, { message: "Seleccione un tipo de reporte" }),

  State: stateEnum.optional(),
  Urgency: urgencyEnum.optional(),
});

export const CreateReportSchema = createReportValidators;
export type CreateReportInput = z.infer<typeof CreateReportSchema>;

// =============== CREATE (User) ===============
export const createReportUserValidators = z.object({
  ExactLocation: z
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
    .int()
    .min(1, { message: "Selecciona tu barrio" }),

  ReportTypeId: z
    .number()
    .int()
    .min(1, { message: "Seleccione tipo de reporte" }),

  Urgency: urgencyEnum.optional(),
});

export const CreateReportUserSchema = createReportUserValidators;
export type CreateReportUserInput = z.infer<typeof CreateReportUserSchema>;

// =============== UPDATE (Edit) ===============
export const updateReportValidators = z.object({
  ExactLocation: z.string().max(200).optional(),
  Description: z.string().max(1000).optional(),
  LocationId: z.number().int().min(0).optional(),
  ReportTypeId: z.number().int().min(0).optional(),
  State: stateEnum.optional(),
  Urgency: urgencyEnum.optional(),
  AdditionalInfo: z.string().optional(),
  stateChangeNote: z.string().optional(),
});

export const UpdateReportSchema = updateReportValidators;
export type UpdateReportInput = z.infer<typeof UpdateReportSchema>;
