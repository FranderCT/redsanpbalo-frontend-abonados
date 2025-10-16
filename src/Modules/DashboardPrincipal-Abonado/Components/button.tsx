import * as React from "react"

type Variant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
type Size = "sm" | "md" | "lg" | "icon"

function cls(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ")
}

const base =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

const variants: Record<Variant, string> = {
  default: "bg-primary text-primary-foreground hover:opacity-95",
  secondary: "bg-secondary text-secondary-foreground hover:opacity-95",
  destructive: "bg-destructive text-destructive-foreground hover:opacity-95",
  outline: "border border-border bg-background hover:bg-muted",
  ghost: "hover:bg-muted",
  link: "text-primary underline-offset-4 hover:underline",
}

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 py-2",
  md: "h-10 px-4 py-2",
  lg: "h-11 px-6 py-3",
  icon: "h-10 w-10",
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export function Button({ className, variant = "default", size = "md", ...props }: ButtonProps) {
  return <button className={cls(base, variants[variant], sizes[size], className)} {...props} />
}
