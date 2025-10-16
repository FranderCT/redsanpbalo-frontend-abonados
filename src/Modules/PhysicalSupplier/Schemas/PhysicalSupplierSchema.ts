import { z } from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

const onlyDigits = (s: string) => s.replace(/\D/g, '');
const upperNoSpaces = (s: string) => s.toUpperCase().trim();

const isCedulaCR = (v: string) => /^\d{9}$/.test(onlyDigits(v));
const isDIMEX = (v: string) => {
  const d = onlyDigits(v);
  return d.length === 11 || d.length === 12;
};

// ✅ Pasaporte “estricto”: alfanumérico 6–20, pero NO colisiona con cédula/DIMEX de solo dígitos
const isPassport = (v: string) => {
  const s = upperNoSpaces(v);
  if (!/^[A-Z0-9]{6,20}$/.test(s)) return false;

  // si es todo dígitos, evitar longitudes típicas de cédula/DIMEX
  if (/^\d+$/.test(s)) {
    const len = s.length;
    if (len === 9 || len === 11 || len === 12) return false;
  }
  return true;
};

// (opcional) helper para tipo
type DocType = 'CR' | 'DIMEX' | 'PASSPORT' | 'INVALID';
const getDocType = (v: string): DocType => {
  if (isCedulaCR(v)) return 'CR';
  if (isDIMEX(v)) return 'DIMEX';
  if (isPassport(v)) return 'PASSPORT';
  return 'INVALID';
};

export const PhysicalSupplierSchema = z.object({
  IDcard: z
    .string()
    .trim()
    .min(1, 'La identificación es obligatoria')
    // sigue permitiendo cualquiera de los tres formatos
    .refine((v) => isCedulaCR(v) || isDIMEX(v) || isPassport(v), {
      message: 'Identificación inválida: cédula (9), DIMEX (11–12) o pasaporte (6–20).',
    }),

  Name: z
    .string()
    .trim()
    .refine((v) => v.length === 0 || v.length >= 2, {
      message: 'Debe tener al menos 2 caracteres si se proporciona',
    }),

  Surname1: z
    .string()
    .trim()
    .refine((v) => v.length === 0 || v.length >= 2, {
      message: 'Debe tener al menos 2 caracteres si se proporciona',
    }),

  Surname2: z
    .string()
    .trim()
    .refine((v) => v.length === 0 || v.length >= 2, {
      message: 'Debe tener al menos 2 caracteres si se proporciona',
    }),

  Email: z
    .string()
    .trim()
    .email('Debe ser un correo electrónico válido.')
    .max(254, 'El correo es demasiado largo'),

  PhoneNumber: z
    .string()
    .refine((val) => isValidPhoneNumber(val), 'Número telefónico inválido'),

  Location: z
    .string()
    .trim()
    .min(10, 'La dirección debe tener al menos 10 caracteres.'),
})
.superRefine((data, ctx) => {
  const docType = getDocType(data.IDcard);

  // ✅ Solo exigir nombre ≥3 si REALMENTE es DIMEX o PASAPORTE
  if ((docType === 'DIMEX' || docType === 'PASSPORT') && data.Name.trim().length < 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Para documento extranjero, ingrese el nombre completo (≥ 3 caracteres).',
      path: ['Name'],
    });
  }

  // (opcional) Si quieres exigir apellidos para cédula CR, descomenta:
  /*
  if (docType === 'CR') {
    if (!data.Surname1 || data.Surname1.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Para cédula CR, el primer apellido es obligatorio (≥ 2).',
        path: ['Surname1'],
      });
    }
    if (!data.Surname2 || data.Surname2.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Para cédula CR, el segundo apellido es obligatorio (≥ 2).',
        path: ['Surname2'],
      });
    }
  }
  */
});

export type CreatePhysicalSupplierInput = z.infer<typeof PhysicalSupplierSchema>;
