import type { User } from "../../Users/Models/User";
import type { ReportLocation } from "./ReportLocation";
import type { ReportType } from "./ReportType";

export type ReportStateValue = "Pendiente" | "En Proceso" | "Resuelto";

export type ReportUserSummary = {
  Id: number;
  Name: string;
  Email: string;
  Surname1?: User["Surname1"];
  Surname2?: User["Surname2"];
  PhoneNumber?: User["PhoneNumber"];
  FullName?: string;
};

export interface ReportAssignmentApi {
  Id: number;
  ReportId: number;
  PlumberUserId: number;
  AssignedByUserId: number;
  Instructions: string;
  CreatedAt: string | Date;
  UpdatedAt: string | Date;
  Plumber?: ReportUserSummary;
  AssignedBy?: ReportUserSummary;
}

export interface ReportStateHistoryApi {
  Id: number;
  ReportId: number;
  PreviousState: ReportStateValue | null;
  NewState: ReportStateValue;
  ReasonChange: string;
  ChangedByUserId: number;
  CreatedAt: string | Date;
  UpdatedAt: string | Date;
  ChangedBy?: ReportUserSummary;
}

export interface ReportApi {
  Id: number;
  Code: string;
  ExactLocation: string;
  Description: string;
  CreatedAt: string | Date;
  UpdatedAt: string | Date;
  ReportLocationId: number;
  ReportTypeId: number;
  ReportedByUserId: number;
  ReportState: ReportStateValue;
  ReportLocation?: ReportLocation | null;
  ReportType?: ReportType | null;
  ReportedBy?: ReportUserSummary;
  Assignment?: ReportAssignmentApi | null;
  StateHistory?: ReportStateHistoryApi[];
}

export interface ReportLiveEvent {
  Id: number;
  Code: string;
  ExactLocation: string;
  Description: string;
  CreatedAt: string | Date;
  ReportState: ReportStateValue;
  ReportLocation?: Pick<ReportLocation, "Id" | "Neighborhood"> | null;
  ReportType?: Pick<ReportType, "Id" | "Name"> | null;
  ReportedBy: Pick<ReportUserSummary, "Id" | "Name" | "Email" | "FullName">;
}

export interface ReportListItem extends Omit<ReportApi, "ReportedBy" | "Assignment"> {
  ReportedBy?: ReportUserSummary;
  Assignment?: ReportAssignmentApi | null;
  AssignedPlumber?: ReportUserSummary | null;
  DisplayLocation: string;
  ReportedByDisplayName: string;
}

export interface ReportPaginationParams {
  page?: number;
  limit: number;
  q?: string;
  state?: ReportStateValue;
  reportLocationId?: number;
  reportTypeId?: number;
  plumberUserId?: number;
  sortDir?: "ASC" | "DESC";
  startDate?: string;
  endDate?: string;
}

export interface CreateReportPayload {
  ExactLocation: string;
  Description: string;
  UserId: number;
  ReportLocationId: number;
  ReportTypeId: number;
}

export interface UpdateReportPayload {
  ExactLocation?: string;
  Description?: string;
  ReportLocationId?: number;
  ReportTypeId?: number;
  ReportState?: ReportStateValue;
}

export interface PaginatedReportsResponse {
  data: ReportApi[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
