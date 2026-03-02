import apiAxios from "../../../api/apiConfig";
import type {
  ReportLocation,
  CreateReportLocationPayload,
  UpdateReportLocationPayload,
} from "../Models/ReportLocation";

const BASE_URL = "/report-location";

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const res = (error as { response?: { data?: { message?: string | string[] } } })
      .response;
    const msg = res?.data?.message;
    if (Array.isArray(msg)) return msg[0] ?? "Error al procesar la solicitud";
    return msg ?? "Error al procesar la solicitud";
  }
  return "Error de conexión al servidor";
}

export async function getAllReportLocations(): Promise<ReportLocation[]> {
  try {
    const { data } = await apiAxios.get<ReportLocation[]>(`${BASE_URL}`);
    return data;
  } catch (error) {
    console.error("Error fetching report locations:", error);
    throw new Error(getErrorMessage(error));
  }
}

export async function getOneReportLocation(id: number): Promise<ReportLocation | null> {
  try {
    const { data } = await apiAxios.get<ReportLocation>(`${BASE_URL}/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching report location:", error);
    throw new Error(getErrorMessage(error));
  }
}

export async function createReportLocation(
  payload: CreateReportLocationPayload
): Promise<ReportLocation> {
  try {
    const { data } = await apiAxios.post<ReportLocation>(BASE_URL, payload);
    return data;
  } catch (error) {
    console.error("Error creating report location:", error);
    throw new Error(getErrorMessage(error));
  }
}

export async function updateReportLocation(
  id: number,
  payload: UpdateReportLocationPayload
): Promise<ReportLocation> {
  try {
    const { data } = await apiAxios.patch<ReportLocation>(`${BASE_URL}/${id}`, payload);
    return data;
  } catch (error) {
    console.error("Error updating report location:", error);
    throw new Error(getErrorMessage(error));
  }
}

export async function removeReportLocation(id: number): Promise<void> {
  try {
    await apiAxios.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error("Error removing report location:", error);
    throw new Error(getErrorMessage(error));
  }
}

