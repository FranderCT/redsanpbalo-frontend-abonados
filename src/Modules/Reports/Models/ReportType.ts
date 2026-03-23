export interface ReportType {
  Id: number;
  Name: string;
  IsActive?: boolean;
}

export interface CreateReportTypePayload {
  Name: string;
}

export interface UpdateReportTypePayload {
  Name?: string;
  IsActive?: boolean;
}
