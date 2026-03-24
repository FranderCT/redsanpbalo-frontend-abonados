import { z } from "zod";
import type { AbonadoSearch } from "../../GeneralGetUser/Model";

const nonNegativeInteger = z
  .number({ invalid_type_error: "Valor inválido" })
  .int("Valor inválido")
  .min(0, "Valor inválido");

export const CreateAssociatedRequestSchema = z
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
    evidenciaBoletaFirmada: z.array(z.instanceof(File)),
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

    const nisList = Array.isArray(data._selectedUser?.Nis)
      ? data._selectedUser.Nis.filter(
          (nis): nis is number => Number.isInteger(nis) && nis > 0,
        )
      : [];

    if (nisList.length === 0 || data.NIS <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El abonado seleccionado debe tener al menos un NIS válido.",
        path: ["UserId"],
      });
    }
  });

export type CreateAssociatedRequestFormValues = z.infer<
  typeof CreateAssociatedRequestSchema
>;
