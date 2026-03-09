import apiAxios from "../../../api/apiConfig";
import type { PaginatedResponse } from "@/core/pagination/pagination";
import type {
  CreateReportPayload,
  UpdateReportPayload,
  Report,
  ReportPaginationParams,
  ReportAssignment,
  ReportStateHistoryEntry,
} from "../Models/Report";

const BASE_URL = "/reports";

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const res = (error as { response?: { data?: { message?: string } } }).response;
    return res?.data?.message ?? "Error al obtener los reportes";
  }
  return "Error de conexión al servidor";
}

export async function getAllReports(): Promise<Report[]> {
  try {
    const { data } = await apiAxios.get<Report[]>(`${BASE_URL}`);
    return data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
}

export async function getReportById(id: number): Promise<Report> {
  const { data } = await apiAxios.get<Report>(`${BASE_URL}/${id}`);
  return data;
}

/** Cantidad de reportes en estado "En progreso" (para dashboard admin) */
export async function getReportsInProcessCount(): Promise<number> {
  try {
    const { data } = await apiAxios.get<PaginatedResponse<Report>>(
      `${BASE_URL}/search`,
      { params: { state: "En progreso", limit: 1, page: 1 } }
    );
    return data?.meta?.totalItems ?? 0;
  } catch {
    return 0;
  }
}

export async function searchReports(
  query: ReportPaginationParams
): Promise<PaginatedResponse<Report>> {
  try {
    const {
      page = 1,
      limit = 10,
      q,
      state,
      locationId,
      reportTypeId,
      sortDir,
      startDate,
      endDate,
    } = query ?? {};
    const cleanParams: Record<string, number | string | undefined> = {
      page,
      limit,
    };
    if (q?.trim()) cleanParams.q = q.trim();
    if (state) cleanParams.state = state;
    if (locationId !== undefined && !isNaN(locationId))
      cleanParams.locationId = locationId;
    if (reportTypeId !== undefined && !isNaN(reportTypeId))
      cleanParams.reportTypeId = reportTypeId;
    if (sortDir === "ASC" || sortDir === "DESC") cleanParams.sortDir = sortDir;
    if (startDate?.trim()) cleanParams.startDate = startDate.trim();
    if (endDate?.trim()) cleanParams.endDate = endDate.trim();

    const { data } = await apiAxios.get<PaginatedResponse<Report>>(
      `${BASE_URL}/search`,
      { params: cleanParams }
    );
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createReportByAdmin(
  payload: CreateReportPayload
): Promise<Report> {
  try {
    const { data } = await apiAxios.post<Report>(`${BASE_URL}/admin`, payload);
    return data;
  } catch (error) {
    console.error("Error creating report:", error);
    throw error;
  }
}

export async function createReportByUser(
  payload: CreateReportPayload
): Promise<Report> {
  try {
    const { data } = await apiAxios.post<Report>(`${BASE_URL}`, payload);
    return data;
  } catch (error) {
    console.error("Error creating report:", error);
    throw error;
  }
}

export async function updateReport(
  reportId: string,
  payload: UpdateReportPayload
): Promise<Report> {
  try {
    const { data } = await apiAxios.patch<Report>(
      `${BASE_URL}/${reportId}`,
      payload
    );
    return data;
  } catch (error) {
    console.error("Error updating report:", error);
    throw error;
  }
}

// ---------- Cambio de estado (dedicado: historial + socket) ----------
export interface ChangeReportStatePayload {
  state: "Pendiente" | "En progreso" | "Cancelado" | "Resuelto";
  note?: string;
}

export async function patchReportState(
  reportId: number,
  payload: ChangeReportStatePayload
): Promise<Report> {
  const { data } = await apiAxios.patch<Report>(
    `${BASE_URL}/${reportId}/state`,
    payload
  );
  return data;
}

// ---------- Asignaciones ----------
export interface AddAssignmentPayload {
  userId: number;
  instructions?: string;
}

export async function getReportAssignments(
  reportId: number
): Promise<ReportAssignment[]> {
  const { data } = await apiAxios.get<ReportAssignment[]>(
    `${BASE_URL}/${reportId}/assignments`
  );
  return data ?? [];
}

export async function addReportAssignment(
  reportId: number,
  payload: AddAssignmentPayload
): Promise<ReportAssignment> {
  const { data } = await apiAxios.post<ReportAssignment>(
    `${BASE_URL}/${reportId}/assignments`,
    payload
  );
  return data;
}

// ---------- Historial de estado ----------
export async function getReportStateHistory(
  reportId: number
): Promise<ReportStateHistoryEntry[]> {
  const { data } = await apiAxios.get<ReportStateHistoryEntry[]>(
    `${BASE_URL}/${reportId}/state-history`
  );
  return data ?? [];
}

// ---------- Comentarios ----------
export interface CreateReportCommentPayload {
  content: string;
  visibleToReporter?: boolean;
}

export interface ReportComment {
  Id: number;
  Content: string;
  UserId: number;
  User?: { Id: number; Name: string; Surname1?: string; Email?: string };
  VisibleToReporter: boolean;
  CreatedAt: string;
}

export async function getReportComments(
  reportId: number,
  requestUserId?: number
): Promise<ReportComment[]> {
  const params =
    requestUserId != null ? { requestUserId } : {};
  const { data } = await apiAxios.get<ReportComment[]>(
    `${BASE_URL}/${reportId}/comments`,
    { params }
  );
  return data ?? [];
}

export async function addReportComment(
  reportId: number,
  payload: CreateReportCommentPayload
): Promise<ReportComment> {
  const { data } = await apiAxios.post<ReportComment>(
    `${BASE_URL}/${reportId}/comments`,
    payload
  );
  return data;
}

// ---------- Estadísticas ----------
/** GET /reports/stats/monthly — state es valor del enum (string) */
export async function getMonthlyReports(params?: {
  months?: number;
  state?: string;
  locationId?: number;
  reportTypeId?: number;
}): Promise<{ year: number; month: number; count: number }[]> {
  const { months = 12, state, locationId, reportTypeId } = params ?? {};
  const search = new URLSearchParams();
  search.set("months", String(months));
  if (state) search.set("state", state);
  if (locationId) search.set("locationId", String(locationId));
  if (reportTypeId) search.set("reportTypeId", String(reportTypeId));
  const { data } = await apiAxios.get<{ year: number; month: number; count: number }[]>(
    `${BASE_URL}/stats/monthly?${search.toString()}`
  );
  return data ?? [];
}

/** Respuesta del endpoint de reportes por mes y ubicación */
export interface MonthlyCountByLocationRow {
  locationId: number;
  neighborhood: string;
  year: number;
  month: number;
  count: number;
}

export async function getMonthlyCountsByLocation(opts: {
  months?: number;
  year?: number;
  month?: number;
} = {}): Promise<MonthlyCountByLocationRow[]> {
  const { months = 12, year, month } = opts;
  const params: Record<string, number> = {};
  if (months) params.months = months;
  if (year) params.year = year;
  if (month) params.month = month;

  try {
    const { data } = await apiAxios.get<MonthlyCountByLocationRow[]>(
      `${BASE_URL}/stats/monthly-by-location`,
      { params }
    );
    return data ?? [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export async function exportReportsPdf(
  year: number,
  month: number
): Promise<{ blob: Blob; filename: string }> {
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    throw new Error("El año debe estar entre 2000 y 2100");
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error("El mes debe estar entre 1 y 12");
  }

  try {
    const { data, headers } = await apiAxios.get<Blob>(
      `${BASE_URL}/export/pdf`,
      {
        params: { year, month },
        responseType: "blob",
      }
    );

    const disposition = headers["content-disposition"];
    let filename = `reportes-${MONTH_NAMES[month - 1]}-${year}.pdf`;
    if (typeof disposition === "string" && disposition.includes("filename=")) {
      const match = disposition.match(/filename="?([^";\n]+)"?/);
      if (match?.[1]) filename = match[1].trim();
    }

    return { blob: data, filename };
  } catch (err) {
    if (err && typeof err === "object" && "response" in err) {
      const res = (err as { response?: { data?: Blob; status?: number } })
        .response;
      if (res?.data instanceof Blob) {
        const text = await (res.data as Blob).text();
        let msg = "Error al exportar el PDF";
        try {
          const json = JSON.parse(text);
          if (json?.message) msg = json.message;
        } catch {
          if (text) msg = text;
        }
        throw new Error(msg);
      }
    }
    throw new Error(getErrorMessage(err));
  }
}
