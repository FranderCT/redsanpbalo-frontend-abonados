import type { User } from "../../Users/Models/User";
import type { ReportLocation } from "./ReportLocation";
import type { ReportType } from "./ReportType";
import type { ReportStateValue, ReportUrgencyValue } from "./ReportEnums";

/** Asignación de fontanero a un reporte */
export interface ReportAssignment {
  Id: number;
  ReportId: number;
  UserId: number;
  Instructions?: string | null;
  AssignedById?: number | null;
  AssignedAt: string;
  User?: User;
  AssignedBy?: User | null;
}

/** Entrada del historial de cambio de estado */
export interface ReportStateHistoryEntry {
  FromState: string;
  ToState: string;
  ChangedBy?: User | null;
  ChangedAt: string;
  Note?: string | null;
}

export interface Report {
  Id: number;
  Code: string;
  ExactLocation: string;
  Description: string;
  CreatedAt: string;
  UserId: number;
  LocationId: number;
  ReportTypeId: number;
  State: ReportStateValue;
  Urgency: ReportUrgencyValue;
  AdditionalInfo?: string | null;
  User?: User;
  ReportLocation?: ReportLocation;
  ReportType?: ReportType;
  Assignments?: ReportAssignment[];
}

/** Parámetros de consulta para listado paginado (state es enum string) */
export interface ReportPaginationParams {
  page?: number;
  limit: number;
  q?: string;
  state?: ReportStateValue;
  locationId?: number;
  reportTypeId?: number;
  sortDir?: "ASC" | "DESC";
  startDate?: string;
  endDate?: string;
}

export interface CreateReportPayload {
  ExactLocation: string;
  Description: string;
  UserId: number;
  LocationId: number;
  ReportTypeId: number;
  State?: ReportStateValue;
  Urgency?: ReportUrgencyValue;
  AdditionalInfo?: string;
}

export interface UpdateReportPayload {
  ExactLocation?: string;
  Description?: string;
  LocationId?: number;
  ReportTypeId?: number;
  State?: ReportStateValue;
  Urgency?: ReportUrgencyValue;
  AdditionalInfo?: string;
  /** Nota para el historial al cambiar estado (solo tiene efecto si se cambia State) */
  stateChangeNote?: string;
}
