/** Estado del reporte (enum en el propio reporte, no tabla) */
export const ReportStateEnum = {
  Pendiente: "Pendiente",
  EnProgreso: "En progreso",
  Cancelado: "Cancelado",
  Resuelto: "Resuelto",
} as const;

export type ReportStateValue =
  | (typeof ReportStateEnum)[keyof typeof ReportStateEnum];

/** Urgencia del reporte */
export const ReportUrgencyEnum = {
  Baja: "baja",
  Media: "media",
  Alta: "alta",
  Critica: "critica",
} as const;

export type ReportUrgencyValue =
  | (typeof ReportUrgencyEnum)[keyof typeof ReportUrgencyEnum];

/** Lista de estados para filtros y selects */
export const REPORT_STATE_OPTIONS: { value: ReportStateValue; label: string }[] = [
  { value: ReportStateEnum.Pendiente, label: "Pendiente" },
  { value: ReportStateEnum.EnProgreso, label: "En progreso" },
  { value: ReportStateEnum.Cancelado, label: "Cancelado" },
  { value: ReportStateEnum.Resuelto, label: "Resuelto" },
];

/** Lista de urgencias para selects */
export const REPORT_URGENCY_OPTIONS: { value: ReportUrgencyValue; label: string }[] = [
  { value: ReportUrgencyEnum.Baja, label: "Baja" },
  { value: ReportUrgencyEnum.Media, label: "Media" },
  { value: ReportUrgencyEnum.Alta, label: "Alta" },
  { value: ReportUrgencyEnum.Critica, label: "Crítica" },
];
