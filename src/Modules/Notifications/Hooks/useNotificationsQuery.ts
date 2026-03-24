import { useQuery } from "@tanstack/react-query";
import { getfindAllByUser, getNotifications } from "../Services/NotificationSV";
import type { Notification } from "../Types/Notification";

type UseNotificationsQueryOptions = {
  onlyCurrentUser?: boolean;
};

export const useNotificationsQuery = ({ onlyCurrentUser = false }: UseNotificationsQueryOptions = {}) => {
  return useQuery<Notification[], Error>({
    queryKey: ["notifications", onlyCurrentUser ? "current-user" : "all"],
    queryFn: onlyCurrentUser ? getfindAllByUser : getNotifications,
    staleTime: 60_000,
    refetchOnMount: "always",
  });
};
