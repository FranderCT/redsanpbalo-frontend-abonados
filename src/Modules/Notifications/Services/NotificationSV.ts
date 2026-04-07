import { mapNotificationResponse } from "@/Modules/utils/utils";
import apiAxios from "../../../api/apiConfig";
import type {
  CreateNotificationPayload,
  Notification,
  NotificationApiResponse,
} from "../Types/Notification";

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

async function postNotificationByRole(
  payload: CreateNotificationPayload
): Promise<NotificationApiResponse> {
  const roleRoutes = [
    `${BASE}/by-role`,
    `${BASE}/role`,
    `${BASE}/create-by-role`,
    BASE,
  ];

  let lastError: unknown;

  for (const route of roleRoutes) {
    try {
      const { data } = await apiAxios.post<NotificationApiResponse>(route, payload);
      return data;
    } catch (error) {
      lastError = error;

      if (
        error &&
        typeof error === "object" &&
        "response" in error
      ) {
        const status = (error as { response?: { status?: number } }).response?.status;

        // 404/400 suelen indicar que esa ruta/DTO no era la correcta; probamos la siguiente.
        if (status === 400 || status === 404) {
          continue;
        }
      }

      throw error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("No se pudo crear la notificacion por rol");
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

export async function createNotificationByRole(
  payload: CreateNotificationPayload
): Promise<NotificationApiResponse> {
  try {
    return await postNotificationByRole(payload);
  } catch (error) {
    console.error("Error creating notification by role:", error);
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

export async function getfindAllByUser(): Promise<Notification[]> {
  try {
    const { data } = await apiAxios.get<NotificationApiResponse[]>(`${BASE}/me`);
    return data.map((response) =>
      mapNotificationResponse({
        ...(response.Notification ?? {}),
        UserNotifications: [
          {
            IsRead: response.Is_Read,
          },
        ],
      })
    );
  } catch (error) {
    console.error("Error fetching notifications for user:", error);
    throw new Error(getErrorMessage(error));
  }
}
