import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import type { Notification } from "../Types/Notification";

type NotificationDetailsModalProps = {
  open: boolean;
  notification: Notification | null;
  onOpenChange: (open: boolean) => void;
};

const dateFormatter = new Intl.DateTimeFormat("es-CR", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export default function NotificationDetailsModal({
  open,
  notification,
  onOpenChange,
}: NotificationDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none border-slate-200 bg-white p-0 sm:rounded-none">
        <DialogHeader className="border-b border-slate-200 p-6">
          <DialogTitle className="text-xl text-[#091540]">{notification?.subject ?? "Notificacion"}</DialogTitle>
          <DialogDescription className="text-slate-500">
            {notification ? dateFormatter.format(new Date(notification.date)) : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Destinatario</p>
            <p className="text-sm text-slate-700">{notification?.targetRoleName ?? "General"}</p>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Descripcion</p>
          <p className="text-sm leading-relaxed text-slate-700">{notification?.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
