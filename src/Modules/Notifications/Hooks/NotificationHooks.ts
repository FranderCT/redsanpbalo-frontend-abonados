import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showApiErrorToast } from "@/core/api-error";
import { createImportantNotification, createNotificationByRole } from "../Services/NotificationSV";
import { ALL_ROLES_OPTION_NAME, type CreateNotificationPayload } from "../Types/Notification";

export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNotificationPayload) =>
      payload.User_Role === ALL_ROLES_OPTION_NAME
        ? createImportantNotification({
            Subject: payload.Subject,
            Message: payload.Message,
          })
        : createNotificationByRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      showApiErrorToast(error);
    },
  });
};
