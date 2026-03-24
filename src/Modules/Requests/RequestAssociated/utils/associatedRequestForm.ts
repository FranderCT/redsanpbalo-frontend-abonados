import type { AbonadoSearch } from "../../GeneralGetUser/Model";

export function getAssociatedRequestNisList(
  user?: Pick<AbonadoSearch, "Nis"> | null,
): number[] {
  if (!Array.isArray(user?.Nis)) return [];

  return user.Nis.filter(
    (nis): nis is number => Number.isInteger(nis) && nis > 0,
  );
}

export function getAssociatedRequestPrimaryNis(
  user?: Pick<AbonadoSearch, "Nis"> | null,
): number {
  return getAssociatedRequestNisList(user)[0] ?? 0;
}
