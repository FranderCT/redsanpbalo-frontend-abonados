import { z } from "zod";
import type { AbonadoSearch } from "../../GeneralGetUser/Model";

const nonNegativeInteger = z
  .number({ invalid_type_error: "Valor inválido" })
  .int("Valor inválido")
  .min(0, "Valor inválido");

const fileArray = z.array(z.instanceof(File));

export const CreateChangeNameMeterRequestSchema = z
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
    _selectedUser: z.custom<AbonadoSearch | null>().nullable(),
  })
  .superRefine((data, ctx) => {
    if (!data._selectedUser || data.UserId <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Debe seleccionar un abonado válido.",
        path: ["UserId"],
      });
    }
  });

export type CreateChangeNameMeterRequestFormValues = z.infer<
  typeof CreateChangeNameMeterRequestSchema
>;
