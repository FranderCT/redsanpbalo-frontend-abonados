import type {
  ReportApi,
  ReportListItem,
  ReportLiveEvent,
  ReportUserSummary,
} from "../Models/Report";

type PartialReportUser = {
  Id: number;
  Name?: string;
  Surname1?: string;
  Surname2?: string;
  Email: string;
  FullName?: string;
  PhoneNumber?: string;
};

function buildFullName(user?: PartialReportUser | null): string {
  if (!user) return "Sin usuario";
  if (user.FullName?.trim()) return user.FullName.trim();
  return [user.Name, user.Surname1, user.Surname2].filter(Boolean).join(" ").trim() || user.Email;
}

function buildDisplayLocation(exactLocation: string, neighborhood?: string | null): string {
  if (!neighborhood?.trim()) return exactLocation;
  return `${neighborhood} - ${exactLocation}`.trim();
}

function mapUser(user?: PartialReportUser | null): ReportUserSummary | undefined {
  if (!user) return undefined;
  return {
    ...user,
    Name: user.Name ?? user.FullName ?? user.Email,
    FullName: buildFullName(user),
  };
}

export function mapReportApiToListItem(report: ReportApi): ReportListItem {
  const reportedBy = mapUser(report.ReportedBy);
  const plumber = mapUser(report.Plumber);

  return {
    ...report,
    ReportedBy: reportedBy,
    AssignedPlumber: plumber ?? null,
    DisplayLocation: buildDisplayLocation(
      report.ExactLocation,
      report.ReportLocation?.Neighborhood
    ),
    ReportedByDisplayName: buildFullName(reportedBy),
  };
}

export function mapLiveEventToListItem(event: ReportLiveEvent): ReportListItem {
  const reportedBy = mapUser(event.ReportedBy);

  return {
    Id: event.Id,
    Code: event.Code,
    ExactLocation: event.ExactLocation,
    Description: event.Description,
    CreatedAt: event.CreatedAt,
    UpdatedAt: event.CreatedAt,
    ReportLocationId: event.ReportLocation?.Id ?? 0,
    ReportTypeId: event.ReportType?.Id ?? 0,
    ReportedByUserId: event.ReportedBy.Id,
    ReportState: event.ReportState,
    ReportLocation: event.ReportLocation ?? null,
    ReportType: event.ReportType ?? null,
    ReportedBy: reportedBy,
    StateHistory: [],
    PhotoUrl: event.PhotoUrl ?? null,
    PlumberUserId: null,
    AssignedByUserId: null,
    Instructions: null,
    Plumber: null,
    AssignedBy: null,
    AssignedPlumber: null,
    DisplayLocation: buildDisplayLocation(
      event.ExactLocation,
      event.ReportLocation?.Neighborhood
    ),
    ReportedByDisplayName: buildFullName(reportedBy),
  };
}

export function withAssignedPlumber(
  report: ReportListItem,
  plumber: ReportUserSummary | null
): ReportListItem {
  return {
    ...report,
    AssignedPlumber: plumber ?? null,
  };
}
