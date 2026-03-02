import type { User } from "../../Users/Models/User";
import type { ReportLocation } from "./ReportLocation";
import type { ReportState } from "./ReportState";
import type { ReportType } from "./ReportType";

export interface Report {
    Id: number;
    Code: string;
    Location: string;
    Description: string;
    User: User; // Cambiado de User[] a User basado en la respuesta del API
    ReportLocation: ReportLocation;
    ReportType: ReportType;
    CreatedAt: Date;
    ReportState: ReportState;
    UserInCharge: User | null;
    AdditionalInfo?: string;
}

/** Parámetros de consulta para listado paginado (alineado con ReportsPaginationDto) */
export interface ReportPaginationParams {
    page?: number;
    limit: number;
    q?: string;
    stateId?: number;
    locationId?: number;
    reportTypeId?: number;
    /** Dirección de orden: ASC | DESC. Por defecto ASC. */
    sortDir?: "ASC" | "DESC";
    /** Fecha desde (inclusive). Formato ISO 8601 (ej: 2024-01-01). */
    startDate?: string;
    /** Fecha hasta (inclusive). Formato ISO 8601 (ej: 2024-12-31). */
    endDate?: string;
}

export interface CreateReportPayload {
    Location: string;
    Description: string;
    UserId: number;
    LocationId: number;
    ReportTypeId: number;
    ReportStateId?: number;
    UserInChargeId?: number;
}

export interface UpdateReportPayload {
    Location?: string;
    Description?: string;
    UserId?: number;
    LocationId?: number;
    ReportTypeId?: number;
    ReportStateId?: number;
    UserInChargeId?: number;
    AdditionalInfo?: string;
}
