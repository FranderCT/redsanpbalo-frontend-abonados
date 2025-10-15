import * as React from "react"

type Variant = "default" | "secondary" | "destructive" | "outline"

const variants: Record<Variant, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  outline: "border border-border",
}

export function Badge({
  className = "",
  variant = "default",
  ...props
}: { className?: string; variant?: Variant } & React.ComponentProps<"span">) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
