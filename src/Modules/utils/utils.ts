import type { Notification, NotificationApiResponse } from "@/Modules/Notifications/Types/Notification";

/**
 * Maps notification API response to view model.
 * Supports both camelCase and PascalCase field names.
 * Optionally includes targetRoleId and targetRoleName for role-specific notifications.
 */
export function mapNotificationResponse(
    response: NotificationApiResponse,
    options?: { targetRoleId?: number; targetRoleName?: string }
    ): Notification {
    const userNotifications = response.UserNotifications ?? [];
    const hasUsers = userNotifications.length > 0;
    const allRead = hasUsers && userNotifications.every((item) => item.isRead ?? item.IsRead ?? false);

    return {
        id: String(response.id ?? response.Id ?? crypto.randomUUID()),
        subject: response.subject ?? response.Subject ?? "",
        description: response.description ?? response.Description ?? response.message ?? response.Message ?? "",
        date: response.date ?? response.Date ?? response.createdAt ?? response.CreatedAt ?? new Date().toISOString(),
        status: response.status ?? response.Status ?? (allRead ? "READ" : "UNREAD"),
        targetRoleId: options?.targetRoleId,
        targetRoleName: options?.targetRoleName ?? "General",
    };
}