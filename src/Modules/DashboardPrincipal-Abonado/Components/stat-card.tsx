// import type * as React from "react"
// import { ArrowDownRight, ArrowUpRight } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "./card"


// export type StatCardProps = {
//   title: string
//   value: string | number
//   description?: string
//   icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
//   trend?: { value: number; isPositive: boolean }
// }

// export function StatCard({ title, value, description, icon: Icon, trend }: StatCardProps) {
//   return (
//     <Card className="border bg-background">
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
//         {Icon ? (
//           <div className="rounded-md p-2 bg-muted">
//             <Icon className="h-4 w-4" />
//           </div>
//         ) : null}
//       </CardHeader>
//       <CardContent className="space-y-2">
//         <div className="text-3xl font-bold tracking-tight">{value}</div>
//         {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
//         {trend ? (
//           <div
//             className={`inline-flex items-center gap-1 text-xs font-medium ${
//               trend.isPositive ? "text-emerald-600" : "text-red-600"
//             }`}
//           >
//             {trend.isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
//             {trend.value}%
//           </div>
//         ) : null}
//       </CardContent>
//     </Card>
//   )
// }
