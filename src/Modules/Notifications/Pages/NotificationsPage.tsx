import { useEffect, useMemo, useState } from "react";
import { Can } from "@/Modules/Auth/Components/Can";
import { useRole } from "@/Modules/Auth/Components/RolesContext";
import { Role } from "@/Modules/Users/Models/Roles";
import { useIsMobile } from "@/hooks/use-mobile";
import CreateNotificationModal from "../Components/CreateNotificationModal";
import NotificationDetailsModal from "../Components/NotificationDetailsModal";
import NotificationFilters from "../Components/NotificationFilters";
import NotificationStats from "../Components/NotificationStats";
import NotificationTable from "../Components/NotificationTable";
import { useNotificationsQuery } from "../Hooks/useNotificationsQuery";
import type { Notification, NotificationFilter } from "../Types/Notification";

const isFromCurrentMonth = (isoDate: string) => {
  const date = new Date(isoDate);
  const now = new Date();

  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

export default function NotificationsPage() {
  const { activeRole } = useRole();
  const isMobile = useIsMobile();
  const shouldLoadCurrentUserNotifications = activeRole !== Role.ADMIN;
  const { data = [], isLoading } = useNotificationsQuery({
    onlyCurrentUser: shouldLoadCurrentUserNotifications,
  });

  const [notifications, setNotifications] = useState<Notification[]>(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("ALL");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
    setNotifications(data);
  }, [data]);

  const sourceNotifications = notifications;

  const filteredNotifications = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return sourceNotifications.filter((notification) => {
      const matchesFilter =
        activeFilter === "ALL" ? true : notification.status === activeFilter;

      const matchesSearch =
        normalizedSearch.length === 0
          ? true
          : `${notification.subject} ${notification.description} ${notification.targetRoleName ?? ""}`
              .toLowerCase()
              .includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchTerm, sourceNotifications]);

  const stats = useMemo(() => {
    const total = sourceNotifications.length;
    const recentThisMonth = sourceNotifications.filter((notification) =>
      isFromCurrentMonth(notification.date)
    ).length;

    return { total, recentThisMonth };
  }, [sourceNotifications]);

  const handleOpenNotification = (notification: Notification) => {
    setSelectedNotification(notification);

    setNotifications((current) => {
      return current.map((item) => {
        if (item.id !== notification.id) {
          return item;
        }

        return item.status === "UNREAD" ? { ...item, status: "READ" } : item;
      });
    });
  };

  const handleCreateNotification = (notification: Notification) => {
    setNotifications((current) => {
      return [notification, ...current];
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#091540]">Notificaciones</h1>
            <p className="mt-1 text-sm text-slate-500">Gestion de notificaciones del sistema</p>
          </div>

          <Can rule={{ any: [Role.ADMIN] }}>
            <CreateNotificationModal onCreate={handleCreateNotification} />
          </Can>
        </header>

        <NotificationStats total={stats.total} recentThisMonth={stats.recentThisMonth} />

        <NotificationFilters
          searchTerm={searchTerm}
          activeFilter={activeFilter}
          onSearchChange={setSearchTerm}
          onFilterChange={setActiveFilter}
        />

        <NotificationTable
          notifications={filteredNotifications}
          isLoading={isLoading}
          isMobile={isMobile}
          onRowClick={handleOpenNotification}
        />

        <NotificationDetailsModal
          open={Boolean(selectedNotification)}
          notification={selectedNotification}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedNotification(null);
            }
          }}
        />
      </div>
    </div>
  );
}
