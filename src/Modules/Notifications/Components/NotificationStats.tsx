import {
  Activity,
  Bell,
  CheckCheck,
} from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";

type NotificationStatsProps = {
  total: number;
  recentThisMonth: number;
};

export default function NotificationStats({
  total,
  recentThisMonth,
}: NotificationStatsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <Card className="rounded-none border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Notificaciones Totales
            </p>
            <Bell className="size-4 text-slate-500" />
          </div>
          <p className="text-4xl font-semibold leading-none text-[#091540]">{total.toLocaleString()}</p>
          {/* <p className="mt-2 text-xs text-slate-500">Acumulado general del sistema</p> */}
        </CardContent>
      </Card>

      <Card className="rounded-none border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Recientes (Este Mes)
            </p>
            <CheckCheck className="size-4 text-slate-500" />
          </div>
          <p className="text-4xl font-semibold leading-none text-[#091540]">{recentThisMonth.toLocaleString()}</p>
          {/* <p className="mt-2 text-xs text-slate-500">Nuevos registros en curso</p> */}
        </CardContent>
      </Card>
{/* 
      <Card className="rounded-none border-[#091540] bg-[#091540] shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-100/90">
              Estado del sistema
            </p>
            <Activity className="size-4 text-blue-100" />
          </div>
          <p className="text-4xl font-semibold leading-none text-white">Servicios Operativos</p>
          <p className="mt-2 text-sm text-blue-100/90">Motor de notificaciones en linea sin retrasos.</p>
        </CardContent>
      </Card> */}
    </section>
  );
}
