import apiAxios from "../../../api/apiConfig";
import type {
  CreateNotificationPayload,
  Notification,
  NotificationApiResponse,
} from "../Types/Notification";
import { mapNotificationResponse } from "@/Modules/utils/utils";

const BASE = "/notification";

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const res = (error as { response?: { data?: { message?: string | string[] } } }).response;
    const msg = res?.data?.message;
    if (Array.isArray(msg)) return msg[0] ?? "Error al procesar la solicitud";
    return msg ?? "Error al procesar la solicitud";
  }

  return "Error de conexion al servidor";
}

export async function createNotification(
  payload: CreateNotificationPayload
): Promise<NotificationApiResponse> {
  try {
    const { data } = await apiAxios.post<NotificationApiResponse>(BASE, payload);
    return data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw new Error(getErrorMessage(error));
  }
}

export async function createImportantNotification(
  payload: CreateNotificationPayload
){
  try {
    const { data } = await apiAxios.post<NotificationApiResponse>(BASE, payload);
    return data;
  } catch (error) {
    console.error("Error creating important notification:", error);
    throw new Error(getErrorMessage(error));
  }
}

export async function getNotifications(): Promise<Notification[]> {
  try {
    const { data } = await apiAxios.get<NotificationApiResponse[]>(BASE);
    return data.map((response) => mapNotificationResponse(response));
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new Error(getErrorMessage(error));
  }
}
