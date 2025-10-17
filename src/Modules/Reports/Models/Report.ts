import type { User } from "../../Users/Models/User";
import type { ReportLocation } from "./ReportLocation";
import type { ReportState } from "./ReportState";
import type { ReportType } from "./ReportType";

export interface Report {
    Id: number;
    Location: string;
    Description: string;
    User: User; // Cambiado de User[] a User basado en la respuesta del API
    ReportLocation: ReportLocation;
    ReportType: ReportType;
    CreatedAt: Date;
    ReportState: ReportState;
    UserInCharge: User | null;
}

export interface ReportPaginationParams {
    page: number;
    limit: number;
    stateId?: number;
    locationId?: number;
    ReportTypeId?: number;
}
