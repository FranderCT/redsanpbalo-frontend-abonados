import { type LucideIcon } from "lucide-react"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "./card";

type Trend = { value: number; isPositive: boolean }
type Props = {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: Trend
  accentColorClass?: string   // ej: "from-indigo-500/10 to-indigo-500/0"
}

export function StatCardPro({
  title,
  value,
  description,
  icon: Icon,
  accentColorClass = "from-primary/10 to-primary/0",
}: Props) {
  return (
    <Card className="
      relative overflow-hidden
      border border-neutral-200/70
      bg-white from-white to-neutral-50
      transition 
      hover:shadow-lg hover:border-primary/40
      hover:-translate-y-0.5
    ">
      {/* banda/acento superior */}
      <div className={`pointer-events-none absolute inset-x-0 -top-8 h-24 ${accentColorClass}`} />

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-sm">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>

          {/* "badge" del icono con estilo mejorado */}
          <CardAction>
            <div className="w-12 h-12 rounded-lg bg-[#091540] flex items-center justify-center shadow-lg">
              <Icon className="w-6 h-6 text-white" />
            </div>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
      </CardContent>
    </Card>
  )
}
