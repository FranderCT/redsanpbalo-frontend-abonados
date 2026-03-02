export interface ReportLocation {
  Id: number;
  Neighborhood: string;
  IsActive?: boolean;
}

export interface CreateReportLocationPayload {
  Neighborhood: string;
}

export interface UpdateReportLocationPayload {
  Neighborhood?: string;
  IsActive?: boolean;
}