import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../Services/NotificationSV";
import type { Notification } from "../Types/Notification";

export const useNotificationsQuery = () => {
  return useQuery<Notification[], Error>({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    staleTime: 60_000,
    refetchOnMount: "always",
  });
};
