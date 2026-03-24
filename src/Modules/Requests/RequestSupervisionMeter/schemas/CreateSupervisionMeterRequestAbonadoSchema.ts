import { z } from "zod";

const nonNegativeInteger = z
  .number({ invalid_type_error: "Valor inválido" })
  .int("Valor inválido")
  .min(0, "Valor inválido");

export const CreateSupervisionMeterRequestAbonadoSchema = z
  .object({
    UserId: nonNegativeInteger,
    NIS: nonNegativeInteger,
    Location: z
      .string({
        required_error: "La ubicación es obligatoria",
        invalid_type_error: "La ubicación es obligatoria",
      })
      .trim()
      .min(10, "La ubicación debe tener al menos 10 caracteres.")
      .max(500, "La ubicación no puede superar 500 caracteres."),
    Justification: z
      .string({
        required_error: "La justificación es obligatoria",
        invalid_type_error: "La justificación es obligatoria",
      })
      .trim()
      .min(10, "La justificación debe tener al menos 10 caracteres.")
      .max(1000, "La justificación no puede superar 1000 caracteres."),
  })
  .superRefine((data, ctx) => {
    if (data.UserId <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "No se pudo identificar el abonado actual.",
        path: ["UserId"],
      });
    }

    if (data.NIS <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Su perfil debe tener al menos un NIS válido para crear la solicitud.",
        path: ["NIS"],
      });
    }
  });

export type CreateSupervisionMeterRequestAbonadoFormValues = z.infer<
  typeof CreateSupervisionMeterRequestAbonadoSchema
>;
