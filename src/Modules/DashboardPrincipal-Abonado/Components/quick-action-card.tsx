// import type * as React from "react"
// import { Card, CardContent } from "./card"
// import { Button } from "./button"


// export type QuickActionCardProps = {
//   title: string
//   description?: string
//   icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
//   onClick?: () => void
// }

// export function QuickActionCard({ title, description, icon: Icon, onClick }: QuickActionCardProps) {
//   return (
//     <Card className="transition hover:shadow-md">
//       <CardContent className="p-4">
//         <div className="flex items-start gap-3">
//           <div className="rounded-md bg-primary/10 p-2">{Icon ? <Icon className="h-5 w-5 text-primary" /> : null}</div>
//           <div className="flex-1">
//             <p className="font-medium leading-none">{title}</p>
//             {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
//             <div className="mt-3">
//               <Button size="sm" variant="secondary" onClick={onClick}>
//                 Abrir
//               </Button>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
