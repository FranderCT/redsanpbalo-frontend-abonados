import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { SimpleChart } from "./simple-chart";


type Datum = { name: string; value: number }

type Variant = "border" | "subtle" | "none"

export function ChartCard({
  title,
  description,
  data,
  color,
  height = 260,
  valueFormatter,
  variant = "subtle",
}: {
  title: string
  description?: string
  data: Datum[]
  color: string
  height?: number
  valueFormatter?: (v: number) => string | number
  variant?: Variant
}) {
  const chrome =
    variant === "border"
      ? "border "
      : variant === "subtle"
      ? // sin borde; ring súper suave para que no se vea más fuerte que el resto
        "border-0 ring-1 ring-black/5 "
      : // none
        "border-0 "

  return (
    <Card className={`hover:shadow-md bg-white transition overflow-hidden ${chrome}`}>
      <CardHeader className="pb-0 px-4">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-0 px-2">
        <SimpleChart
          variant="in-card"
          data={data}
          color={color}
          height={height}
          valueFormatter={valueFormatter}
        />
      </CardContent>
    </Card>
  )
}
