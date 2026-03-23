import apiAxios from "../../../api/apiConfig";
import type {
  CreateReportPayload,
  PaginatedReportsResponse,
  ReportApi,
  ReportPaginationParams,
  UpdateReportPayload,
} from "../Models/Report";

const BASE_URL = "/reports";

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const res = (error as { response?: { data?: { message?: string } } })
      .response;
    return res?.data?.message ?? "Error al obtener los reportes";
  }
  return "Error de conexión al servidor";
}

export async function getAllReports(): Promise<ReportApi[]> {
  try {
    const { data } = await apiAxios.get<ReportApi[]>(`${BASE_URL}`);
    return data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
}

export async function searchReports(
  query: ReportPaginationParams,
): Promise<PaginatedReportsResponse> {
  try {
    const {
      page = 1,
      limit = 10,
      q,
      state,
      reportLocationId,
      reportTypeId,
      plumberUserId,
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
    if (reportLocationId !== undefined && !isNaN(reportLocationId))
      cleanParams.reportLocationId = reportLocationId;
    if (reportTypeId !== undefined && !isNaN(reportTypeId))
      cleanParams.reportTypeId = reportTypeId;
    if (plumberUserId !== undefined && !isNaN(plumberUserId))
      cleanParams.plumberUserId = plumberUserId;
    if (sortDir === "ASC" || sortDir === "DESC") cleanParams.sortDir = sortDir;
    if (startDate?.trim()) cleanParams.startDate = startDate.trim();
    if (endDate?.trim()) cleanParams.endDate = endDate.trim();

    const { data } = await apiAxios.get<PaginatedReportsResponse>(
      `${BASE_URL}/search`,
      {
        params: cleanParams,
      },
    );
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createReportByAdmin(
  payload: CreateReportPayload,
): Promise<ReportApi> {
  try {
    const { data } = await apiAxios.post<ReportApi>(`${BASE_URL}`, payload);
    return data;
  } catch (error) {
    console.error("Error creating report:", error);
    throw error;
  }
}

export async function createReportByUser(
  payload: CreateReportPayload,
): Promise<ReportApi> {
  try {
    const { data } = await apiAxios.post<ReportApi>(`${BASE_URL}`, payload);
    return data;
  } catch (error) {
    console.error("Error creating report:", error);
    throw error;
  }
}

export async function uploadReportPhoto(
  reportId: number,
  photo: File,
): Promise<ReportApi> {
  try {
    const formData = new FormData();
    formData.append("photo", photo);
    const { data } = await apiAxios.post<ReportApi>(
      `${BASE_URL}/${reportId}/photo`,
      formData,
    );
    return data;
  } catch (error) {
    console.error("Error uploading report photo:", error);
    throw error;
  }
}

export async function assignUserInCharge(
  reportId: string,
  plumberUserId: number,
  instructions = "Asignado desde el panel administrativo",
): Promise<ReportApi> {
  try {
    const { data } = await apiAxios.post<ReportApi>(
      `${BASE_URL}/${reportId}/assignments`,
      {
        plumberUserId,
        instructions,
      },
    );
    return data;
  } catch (error) {
    console.error("Error assigning user in charge:", error);
    throw error;
  }
}

export async function updateReport(
  reportId: string,
  payload: UpdateReportPayload,
): Promise<ReportApi> {
  try {
    const { data } = await apiAxios.patch<ReportApi>(
      `${BASE_URL}/${reportId}`,
      payload,
    );
    return data;
  } catch (error) {
    console.error("Error updating report:", error);
    throw error;
  }
}

export async function changeReportState(
  reportId: string,
  newState: NonNullable<UpdateReportPayload["ReportState"]>,
  reasonChange = "Cambio de estado realizado desde el panel de reportes",
): Promise<ReportApi> {
  try {
    const { data } = await apiAxios.post<ReportApi>(
      `${BASE_URL}/${reportId}/state-transitions`,
      {
        newState,
        reasonChange,
      },
    );
    return data;
  } catch (error) {
    console.error("Error changing report state:", error);
    throw error;
  }
}

/** Respuesta del endpoint de reportes por mes y ubicación */
export interface MonthlyCountByLocationRow {
  locationId: number;
  neighborhood: string;
  year: number;
  month: number;
  count: number;
}

/**
 * Obtiene la cantidad de reportes por ubicación y mes.
 * - Si se pasa year y month: estadísticas SOLO para ese mes/año.
 * - Si no: últimos `months` meses hacia atrás.
 *
 * GET /reports/stats/monthly-by-location?months=12&year=2025&month=3
 */
export async function getMonthlyCountsByLocation(
  opts: {
    months?: number;
    year?: number;
    month?: number;
  } = {},
): Promise<MonthlyCountByLocationRow[]> {
  const { months = 12, year, month } = opts;

  const params: { months?: number; year?: number; month?: number } = {};
  if (months) params.months = months;
  if (year) params.year = year;
  if (month) params.month = month;

  try {
    const { data } = await apiAxios.get<MonthlyCountByLocationRow[]>(
      `${BASE_URL}/stats/monthly-by-location`,
      { params },
    );
    return data ?? [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

/**
 * Exporta Excel de reportes del mes/año con formato legible.
 * GET /reports/export/excel?year=YYYY&month=M
 * Descarga el archivo con nombre reportes-{Mes}-{year}.xlsx
 */
export async function exportReportsExcel(
  year: number,
  month: number,
): Promise<{ blob: Blob; filename: string }> {
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    throw new Error("El año debe estar entre 2000 y 2100");
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error("El mes debe estar entre 1 y 12");
  }

  try {
    const { data, headers } = await apiAxios.get<Blob>(
      `${BASE_URL}/export/excel`,
      {
        params: { year, month },
        responseType: "blob",
      },
    );

    const disposition = headers["content-disposition"];
    let filename = `reportes-${MONTH_NAMES[month - 1]}-${year}.xlsx`;
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
        let msg = "Error al exportar el Excel";
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
