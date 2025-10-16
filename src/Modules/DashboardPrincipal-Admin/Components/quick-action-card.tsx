import { type LucideIcon } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "./card";


export function QuickActionCardPro({
  title, description, icon: Icon, onClick,
}: { title: string; description?: string; icon: LucideIcon; onClick?: () => void }) {
  return (
    <Card
      onClick={onClick}
      className="
        group cursor-pointer select-none
        border border-neutral-200/70 bg-white
        transition hover:shadow-lg hover:border-primary/40 hover:-translate-y-0.5
        active:translate-y-[1px]
      "
    >
      <CardHeader className="flex flex-row items-center gap-4 p-5">
        <div className="relative">
          <div className="absolute inset-0 blur-md opacity-30 bg-primary/20 rounded-xl" />
          <div className="relative h-10 w-10 flex items-center justify-center rounded-xl
                          bg-gradient-to-br from-primary/10 to-white border border-neutral-200
                          group-hover:from-primary/20">
            <Icon className="h-5 w-5 text-neutral-700" />
          </div>
        </div>
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
      </CardHeader>
    </Card>
  )
}
