export type ProjectStateTone = "success" | "warning" | "danger" | "info" | "neutral";

function normalizeText(value?: string) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function getProjectStateTone(status?: string): ProjectStateTone {
  const normalized = normalizeText(status);

  if (normalized.includes("pend")) {
    return "warning";
  }

  if (
    normalized.includes("proce") ||
    normalized.includes("ejecu") ||
    normalized.includes("curso")
  ) {
    return "info";
  }

  if (
    normalized.includes("aproba") ||
    normalized.includes("activo") ||
    normalized.includes("complet") ||
    normalized.includes("final")
  ) {
    return "success";
  }

  if (
    normalized.includes("planifica")
  ) {
    return "warning";
  }

  if (
    normalized.includes("rechaz") ||
    normalized.includes("deneg") ||
    normalized.includes("cancel") ||
    normalized.includes("inactivo")
  ) {
    return "danger";
  }

  if (
    normalized.includes("revision") ||
    normalized.includes("tramite")
  ) {
    return "info";
  }

  return "neutral";
}

export function getProjectStateBadgeClass(status?: string) {
  switch (getProjectStateTone(status)) {
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "warning":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "danger":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "info":
      return "border-blue-200 bg-blue-50 text-blue-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}
