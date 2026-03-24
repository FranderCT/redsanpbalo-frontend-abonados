import { z } from "zod";

const nonNegativeInteger = z
  .number({ invalid_type_error: "Valor inválido" })
  .int("Valor inválido")
  .min(0, "Valor inválido");

const fileArray = z.array(z.instanceof(File));

export const CreateChangeNameMeterRequestAbonadoSchema = z
  .object({
    UserId: nonNegativeInteger,
    NIS: nonNegativeInteger,
    Justification: z
      .string({
        required_error: "La justificación es obligatoria",
        invalid_type_error: "La justificación es obligatoria",
      })
      .trim()
      .min(10, "La justificación debe tener al menos 10 caracteres.")
      .max(1000, "La justificación no puede superar 1000 caracteres."),
    fotocopiaCedula: fileArray,
    copiaPlano: fileArray,
    literalCerfication: fileArray,
  })
  .superRefine((data, ctx) => {
    if (data.UserId <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "No se pudo identificar el abonado actual.",
        path: ["UserId"],
      });
    }
  });

export type CreateChangeNameMeterRequestAbonadoFormValues = z.infer<
  typeof CreateChangeNameMeterRequestAbonadoSchema
>;
