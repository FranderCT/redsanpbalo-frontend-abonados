import { z } from "zod";
import type { User } from "../../../Users/Models/User";

const nonNegativeInteger = z
  .number({ invalid_type_error: "Valor inválido" })
  .int("Valor inválido")
  .min(0, "Valor inválido");

export const CreateAvailabilityWaterRequestSchema = z
  .object({
    UserId: nonNegativeInteger,
    Justification: z
      .string({
        required_error: "La justificación es obligatoria",
        invalid_type_error: "La justificación es obligatoria",
      })
      .trim()
      .min(10, "La justificación debe tener al menos 10 caracteres.")
      .max(1000, "La justificación no puede superar 1000 caracteres."),
    fotocopiaCedula: z.array(z.instanceof(File)),
    copiaPlano: z.array(z.instanceof(File)),
    permisoMatricula: z.array(z.instanceof(File)),
    permisoMunicipal: z.array(z.instanceof(File)),
    _selectedUser: z.custom<User | null>().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.UserId <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Debe seleccionar un usuario solicitante.",
        path: ["UserId"],
      });
    }
  });

export type CreateAvailabilityWaterRequestFormValues = z.infer<
  typeof CreateAvailabilityWaterRequestSchema
>;
