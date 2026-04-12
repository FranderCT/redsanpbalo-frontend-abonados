import { z } from "zod";

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const trimString = (value: unknown) =>
  typeof value === "string" ? value.trim() : value;

const toDateOnlyString = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().split("T")[0];
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return value;
};

const optionalTrimmedString = (max: number, maxMessage: string) =>
  z.preprocess(
    (value) => {
      const trimmed = trimString(value);
      return trimmed === "" ? undefined : trimmed;
    },
    z.string().max(max, maxMessage).optional(),
  );

const requiredTrimmedString = (requiredMessage: string, max: number, maxMessage: string) =>
  z.preprocess(
    trimString,
    z
      .string({
        required_error: requiredMessage,
        invalid_type_error: requiredMessage,
      })
      .min(1, requiredMessage)
      .max(max, maxMessage),
  );

const requiredDateOnly = (requiredMessage: string, formatMessage: string) =>
  z.preprocess(
    toDateOnlyString,
    z
      .string({
        required_error: requiredMessage,
        invalid_type_error: formatMessage,
      })
      .min(1, requiredMessage)
      .regex(DATE_ONLY_REGEX, formatMessage),
  );

const optionalDateOnly = (formatMessage: string) =>
  z.preprocess(
    toDateOnlyString,
    z
      .string({
        invalid_type_error: formatMessage,
      })
      .regex(DATE_ONLY_REGEX, formatMessage)
      .optional(),
  );

const optionalPositiveInt = (invalidMessage: string, minMessage: string) =>
  z
    .number({
      invalid_type_error: invalidMessage,
    })
    .int(invalidMessage)
    .min(1, minMessage)
    .optional();

const requiredPositiveInt = (requiredMessage: string, invalidMessage: string, minMessage: string) =>
  z
    .number({
      required_error: requiredMessage,
      invalid_type_error: invalidMessage,
    })
    .int(invalidMessage)
    .min(1, minMessage);

export const UpdateProjectBase = z.object({
    Name: requiredTrimmedString(
      "El nombre del proyecto es obligatorio",
      255,
      "El nombre del proyecto no puede superar los 255 caracteres",
    ),
    Location: requiredTrimmedString(
      "La ubicación es obligatoria",
      500,
      "La ubicación no puede superar los 500 caracteres",
    ),
    InnitialDate: requiredDateOnly(
      "La fecha inicial es obligatoria",
      "La fecha inicial debe tener el formato YYYY-MM-DD",
    ),
    EndDate: optionalDateOnly("La fecha final debe tener el formato YYYY-MM-DD"),
    Objective: requiredTrimmedString(
      "El objetivo es obligatorio",
      5000,
      "El objetivo no puede superar los 5000 caracteres",
    ),
    Description: requiredTrimmedString(
      "La descripción es obligatoria",
      10000,
      "La descripción no puede superar los 10000 caracteres",
    ),
    Observation: optionalTrimmedString(
      5000,
      "La observación no puede superar los 5000 caracteres",
    ),
    SpaceOfDocument: optionalTrimmedString(
      1000,
      "El espacio de documentos no puede superar los 1000 caracteres",
    ),
    ProjectStateId: requiredPositiveInt(
      "El estado del proyecto es obligatorio",
      "Debe seleccionar un estado de proyecto válido",
      "Debe seleccionar un estado de proyecto válido",
    ),
    UserId: requiredPositiveInt(
      "El usuario responsable es obligatorio",
      "Debe seleccionar un usuario responsable válido",
      "Debe seleccionar un usuario responsable válido",
    ),
    IsActive: z.boolean().optional(),
    CanComment: z.boolean().optional(),
  });

export const UpdateProjectSchema = UpdateProjectBase
  .superRefine((val, ctx) => {
    if (val.InnitialDate && val.EndDate && val.EndDate < val.InnitialDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["EndDate"],
        message: "La fecha de fin debe ser mayor o igual a la fecha de inicio.",
      });
    }
  });

export type UpdateProjectFormValues = z.infer<typeof UpdateProjectSchema>;
