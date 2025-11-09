// Modules/Project/schemas/ProjectSchema.ts
import { z } from "zod";

export const ProjectBase = z.object({
  Name: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres.").max(400, "El nombre no puede superar los 400 caracteres."),
  Location: z.string().trim().min(5, "La ubicación debe tener al menos 5 caracteres.").max(400, "La ubicación no puede superar los 400 caracteres."),

  InnitialDate: z.coerce.date({ 
    required_error: "La fecha de inicio es obligatoria.", 
    invalid_type_error: "La fecha de inicio no es válida." 
  }),
  EndDate: z.coerce.date({ 
    required_error: "La fecha de fin es obligatoria.", 
    invalid_type_error: "La fecha de fin no es válida." 
  }),

  Objective: z.string().trim().min(5, "El objetivo debe tener al menos 5 caracteres.").max(400, "El objetivo no puede superar los 400 caracteres."),
  Description: z.string().trim().min(10, "La descripción debe tener al menos 10 caracteres.").max(2000, "La descripción no puede superar los 2000 caracteres."),

  Observation: z.string().trim().max(500, "La observación no puede superar los 500 caracteres.").default(""),

  ProjectStateId: z.number({ 
    required_error: "Debe seleccionar un estado de proyecto.", 
    invalid_type_error: "El estado del proyecto debe ser un número." 
  })
  .int("El estado debe ser un número entero.")
  .positive("Debe elegir un estado válido (mayor a 0)."),

  UserId: z.number({ 
    required_error: "Debe seleccionar un encargado del proyecto.", 
    invalid_type_error: "El encargado debe ser un número." 
  })
  .int("El encargado debe ser un número entero.")
  .positive("Debe elegir un encargado válido."),

  projection: z.object({
    Observation: z.string().trim().max(500, "La observación de la proyección no puede superar los 500 caracteres.").default(""),
  }).default({ Observation: "" }),

  productDetails: z.array(
    z.object({
      ProductId: z.number({ 
        required_error: "Debe seleccionar un producto.", 
        invalid_type_error: "El producto debe ser un número." 
      })
      .int("El producto debe ser un número entero.")
      .positive("Debe elegir un producto válido."),
      
      Quantity: z.number({ 
        required_error: "La cantidad es obligatoria.", 
        invalid_type_error: "La cantidad debe ser un número." 
      })
      .int("La cantidad debe ser un número entero.")
      .positive("La cantidad debe ser mayor a 0."),
    })
  ).default([]),

  // Campos opcionales del formulario
  subfolder: z.string().default(""),
  files: z.array(z.any()).default([]),
});

// Validación global con superRefine
export const ProjectSchema = ProjectBase.superRefine((val, ctx) => {
  if (val.EndDate.getTime() < val.InnitialDate.getTime()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["EndDate"],
      message: "La fecha de fin debe ser mayor o igual a la fecha de inicio.",
    });
  }
});

export type ProjectFormValues = z.infer<typeof ProjectSchema>;