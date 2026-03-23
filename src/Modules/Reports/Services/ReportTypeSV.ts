import apiAxios from "../../../api/apiConfig";
import type {
  ReportType,
  CreateReportTypePayload,
  UpdateReportTypePayload,
} from "../Models/ReportType";

const BASE_URL = "/report-types";

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

export async function getAllReportTypes(): Promise<ReportType[]> {
  try {
    const { data } = await apiAxios.get<ReportType[]>(`${BASE_URL}`);
    return data;
  } catch (error) {
    console.error("Error fetching report types:", error);
    throw new Error(getErrorMessage(error));
  }
}

export async function getOneReportType(id: number): Promise<ReportType | null> {
  try {
    const { data } = await apiAxios.get<ReportType>(`${BASE_URL}/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching report type:", error);
    throw new Error(getErrorMessage(error));
  }
}

export async function createReportType(
  payload: CreateReportTypePayload
): Promise<ReportType> {
  try {
    const { data } = await apiAxios.post<ReportType>(BASE_URL, payload);
    return data;
  } catch (error) {
    console.error("Error creating report type:", error);
    throw new Error(getErrorMessage(error));
  }
}

export async function updateReportType(
  id: number,
  payload: UpdateReportTypePayload
): Promise<ReportType> {
  try {
    const { data } = await apiAxios.patch<ReportType>(`${BASE_URL}/${id}`, payload);
    return data;
  } catch (error) {
    console.error("Error updating report type:", error);
    throw new Error(getErrorMessage(error));
  }
}

export async function removeReportType(id: number): Promise<void> {
  try {
    await apiAxios.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error("Error removing report type:", error);
    throw new Error(getErrorMessage(error));
  }
}
