type WithNis = {
  Nis?: unknown;
};

export const getChangeNameMeterAvailableNis = (source: WithNis | null | undefined) => {
  if (!Array.isArray(source?.Nis)) return [];

  return source.Nis.filter((nis): nis is number => Number.isInteger(nis) && nis > 0);
};

export const getChangeNameMeterPrimaryNis = (source: WithNis | null | undefined) => {
  return getChangeNameMeterAvailableNis(source)[0] ?? 0;
};
