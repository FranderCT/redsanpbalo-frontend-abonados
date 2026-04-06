export const formatAvailabilityWaterDate = (value?: string | Date) => {
  if (!value) return "Sin fecha";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin fecha";

  return date.toLocaleDateString("es-CR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
