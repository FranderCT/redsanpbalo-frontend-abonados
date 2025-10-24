export interface PendingDashboardResponse {
  totalPendingRequests: number;
}

export interface ApprovedDashboardResponse {
  totalApprovedRequests: number;
}

export interface MonthlyPoint { year: number; month: number; count: number };