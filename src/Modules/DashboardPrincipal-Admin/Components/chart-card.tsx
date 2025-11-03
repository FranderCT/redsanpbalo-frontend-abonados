// Components/BarChartCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

type Datum = { name: string; value: number }

type Variant = "border" | "subtle" | "none"

export function BarChartCard({
  title,
  description,
  data,
  color = "hsl(var(--chart-1))",
  height = 260,
  variant = "subtle",
  valueFormatter,
}: {
  title: string
  description?: string
  data: Datum[]
  color?: string
  height?: number
  variant?: Variant
  valueFormatter?: (v: number) => string | number
}) {
  const chrome =
    variant === "border"
      ? "border "
      : variant === "subtle"
      ? "border-0 ring-1 ring-black/5 "
      : "border-0 "

  return (
    <Card className={`hover:shadow-md bg-white transition overflow-hidden ${chrome}`}>
      <CardHeader className="pb-0 px-4">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-2 px-2">
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
                formatter={(v: number) =>
                  valueFormatter ? valueFormatter(v) : v.toString()
                }
              />
              <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
