export interface ReportLocation {
  Id: number;
  Neighborhood: string;
}

export interface CreateReportLocationPayload {
  Neighborhood: string;
}

export interface UpdateReportLocationPayload {
  Neighborhood?: string;
}