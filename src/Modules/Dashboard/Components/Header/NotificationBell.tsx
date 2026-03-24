import { useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/Sockets/useNotifications";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const isFirstEmit = useRef(true);

  useEffect(() => {
    if (notifications.length === 0) return;

    if (isFirstEmit.current) {
      isFirstEmit.current = false;
      return;
    }
  }, [notifications]);

  return (
    <Popover onOpenChange={(open) => { if (open) markAllRead(); }}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Notificaciones"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white leading-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notificaciones</p>
          {notifications.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {notifications.length} en total
            </span>
          )}
        </div>

        <ul className="max-h-72 overflow-y-auto divide-y">
          {notifications.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-muted-foreground">
              Sin notificaciones
            </li>
          ) : (
            notifications.map((n) => (
              <li key={n.Id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bell className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight truncate">{n.Subject}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.Message}</p>
                  <p className="text-[11px] text-muted-foreground/70 mt-1">{n.Hour}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
