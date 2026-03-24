import type { ProjectPaginationParams } from "./Models/Project";

const projectsRoot = ["projects"] as const;
const projectDashboardRoot = ["dashboard", "projects-in-process", "count"] as const;

export const projectKeys = {
  all: projectsRoot,
  list: () => [...projectsRoot, "list"] as const,
  searchRoot: () => [...projectsRoot, "search"] as const,
  search: (params: ProjectPaginationParams) => [...projectsRoot, "search", params] as const,
  detailRoot: () => [...projectsRoot, "detail"] as const,
  detail: (projectId: number) => [...projectsRoot, "detail", projectId] as const,
  projectionRoot: () => [...projectsRoot, "projection"] as const,
  traceRoot: () => [...projectsRoot, "trace"] as const,
  traceDetail: (traceId: number) => [...projectsRoot, "trace", "detail", traceId] as const,
  tracesByProject: (projectId: number) => [...projectsRoot, "detail", projectId, "traces"] as const,
  totalActualExpense: (projectId: number) =>
    [...projectsRoot, "detail", projectId, "total-actual-expense"] as const,
  dashboardInProcessCount: projectDashboardRoot,
} as const;
