export function formatRequestChangeMeterDate(value?: string | Date | null) {
  if (!value) return "Sin fecha";

  if (typeof value === "string") {
    const onlyDate = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (onlyDate) {
      const [, year, month, day] = onlyDate;
      return `${day}/${month}/${year}`;
    }

    const isoDate = value.match(/^(\d{4})-(\d{2})-(\d{2})T/);
    if (isoDate) {
      const [, year, month, day] = isoDate;
      return `${day}/${month}/${year}`;
    }
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin fecha";

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}
