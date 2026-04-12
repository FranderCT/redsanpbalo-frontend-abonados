// Modules/Project/schemas/ProjectSchema.ts
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

const optionalTrimmedString = (max: number, maxMessage: string) =>
  z.preprocess(
    (value) => {
      const trimmed = trimString(value);
      return trimmed === "" ? undefined : trimmed;
    },
    z.string().max(max, maxMessage).optional(),
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

const positiveInt = (requiredMessage: string, intMessage: string, minMessage: string) =>
  z
    .number({
      required_error: requiredMessage,
      invalid_type_error: intMessage,
    })
    .int(intMessage)
    .min(1, minMessage);

export const ProjectBase = z.object({
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
    "La fecha inicial debe tener el formato dd/mm/aaaa",
  ),
  EndDate: optionalDateOnly("La fecha final debe tener el formato dd/mm/aaaa"),
  Objective: requiredTrimmedString(
    "El objetivo es obligatorio",
    8000,
    "El objetivo no puede superar los 8000 caracteres (incluyendo formato HTML)",
  ),
  Description: requiredTrimmedString(
    "La descripción es obligatoria",
    20000,
    "La descripción no puede superar los 20000 caracteres (incluyendo formato HTML)",
  ),
  Observation: optionalTrimmedString(
    10000,
    "La observación no puede superar los 10000 caracteres (incluyendo formato HTML)",
  ),
  SpaceOfDocument: optionalTrimmedString(
    1000,
    "El espacio de documentos no puede superar los 1000 caracteres",
  ),
  ProjectStateId: positiveInt(
    "El estado del proyecto es obligatorio",
    "Debe seleccionar un estado de proyecto válido",
    "Debe seleccionar un estado de proyecto válido",
  ),

  projection: z.object({
    Observation: optionalTrimmedString(
      10000,
      "La observación de la proyección no puede superar los 10000 caracteres (incluyendo formato HTML)",
    ),
  }),

  productDetails: z.array(
    z.object({
      ProductId: z.number({ required_error: "Debe seleccionar un producto.", invalid_type_error: "El producto debe ser un número." })
                   .int("El producto debe ser un número entero.")
                   .positive("Debe elegir un producto válido."),
      Quantity: z.number({ required_error: "La cantidad es obligatoria.", invalid_type_error: "La cantidad debe ser un número." })
                 .int("La cantidad debe ser un número entero.")
                 .positive("La cantidad debe ser mayor a 0."),
    })
  ),

  UserId: positiveInt(
    "El usuario responsable es obligatorio",
    "Debe seleccionar un usuario responsable válido",
    "Debe seleccionar un usuario responsable válido",
  ),
});

// ← Este es el que usas como validador global del formulario
export const ProjectSchema = ProjectBase.superRefine((val, ctx) => {
  if (val.EndDate && val.EndDate < val.InnitialDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["EndDate"],
      message: "La fecha de fin debe ser mayor o igual a la fecha de inicio.",
    });
  }
});

export type ProjectFormValues = z.infer<typeof ProjectSchema>;
