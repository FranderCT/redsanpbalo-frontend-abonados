// src/modules/users/validation/EditUserSchema.ts
import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export const EditUserSchema = z.object({
  PhoneNumber: z
    .string({
      required_error: "El teléfono es obligatorio",
      invalid_type_error: "El teléfono es obligatorio",
    })
    .refine((val) => isValidPhoneNumber(val), "Número telefónico inválido"),

  Nis: z
    .array(
      z
        .number({
          invalid_type_error: "Cada NIS debe ser numérico",
        })
        .int("Cada NIS debe ser un número entero")
        .positive("Cada NIS debe ser un número positivo")
    ),

  Address: z
    .string({
      required_error: "La dirección es obligatoria",
      invalid_type_error: "La dirección es obligatoria",
    })
    .trim()
    .min(10, "La dirección debe tener al menos 10 caracteres.")
    .max(255, "La dirección no puede superar 255 caracteres."),

  roleIds: z
    .array(
      z
        .number({ invalid_type_error: "Rol inválido" })
        .int("Rol inválido")
        .positive("Rol inválido")
    )
    .min(1, "Debe asignar al menos un rol al usuario"),

  IsActive: z.boolean({
    required_error: "El estado (activo/inactivo) es obligatorio",
    invalid_type_error: "El estado (activo/inactivo) es inválido",
  }),
});

export const EditUserSchemaWithRules = EditUserSchema.superRefine((data, ctx) => {
  const set = new Set<number>();
  for (const n of data.Nis) {
    if (set.has(n)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Hay NIS repetidos",
        path: ["Nis"],
      });
      break;
    }
    set.add(n);
  }
});

export type EditUserFormValues = z.infer<typeof EditUserSchema>;
