import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type Datum = { name: string; value: number }

type Props = {
  data: Datum[]
  color?: string
  height?: number
  valueFormatter?: (v: number) => string | number
  variant?: "standalone" | "in-card"
  title?: string
  description?: string
}

export function SimpleChart({
  data,
  color = "#06b6d4",
  height = 260,
  valueFormatter,
  variant = "standalone",
  title,
  description,
}: Props) {
  const gradId = `grad-${Math.random().toString(36).slice(2)}`

  const ChartBody = (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="8%" stopColor={color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={color} stopOpacity={0.06} />
            </linearGradient>
          </defs>

          {/* líneas/ejes suaves */}
          <CartesianGrid stroke="#eef2f7" strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={{ stroke: "#eaeef3" }}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={{ stroke: "#eaeef3" }}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickFormatter={(v) => (valueFormatter ? valueFormatter(v) : v)}
            width={40}
          />
          <Tooltip
            cursor={{ stroke: "#cbd5e1", strokeDasharray: "4 4" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #eaeef3",
              boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
            }}
            labelStyle={{ color: "#0f172a", fontWeight: 600 }}
            formatter={(v: number) => [valueFormatter ? valueFormatter(v) : v, "Valor"]}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill={`url(#${gradId})`}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )

  // Estado vacío
  if (!data || data.length === 0) {
    if (variant === "in-card") {
      return (
        <div className="h-[200px] flex items-center justify-center">
          <p className="text-sm text-gray-500">Sin datos para mostrar</p>
        </div>
      )
    }
    return (
      <div className="rounded-xl border bg-white p-4">
        {(title || description) && (
          <div className="mb-2">
            {title && <h4 className="font-semibold">{title}</h4>}
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
        )}
        <div className="h-[200px] flex items-center justify-center">
          <p className="text-sm text-gray-500">Sin datos para mostrar</p>
        </div>
      </div>
    )
  }

  if (variant === "in-card") return ChartBody

  return (
    <div className=" border bg-white p-4">
      {(title || description) && (
        <div className="mb-2">
          {title && <h4 className="font-semibold">{title}</h4>}
          {description && <p className="text-sm text-white">{description}</p>}
        </div>
      )}
      {ChartBody}
    </div>
  )
}
