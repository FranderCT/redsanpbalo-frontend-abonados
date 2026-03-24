import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showApiErrorToast } from "@/core/api-error";
import { createImportantNotification, createNotification } from "../Services/NotificationSV";
import { ALL_ROLES_OPTION_ID, type CreateNotificationPayload } from "../Types/Notification";

export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNotificationPayload) =>
      payload.TargetRoleId === ALL_ROLES_OPTION_ID
        ? createImportantNotification({
            Subject: payload.Subject,
            Message: payload.Message,
          })
        : createNotification(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      showApiErrorToast(error);
    },
  });
};
