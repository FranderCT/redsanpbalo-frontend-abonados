import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const defaultToastOptions: NonNullable<ToasterProps["toastOptions"]> = {
  classNames: {
    toast:
      "group toast group-[.toaster]:bg-white group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
    description: "group-[.toast]:text-muted-foreground",
    actionButton:
      "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
    cancelButton:
      "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
  },
}

const Toaster = ({ ...props }: ToasterProps) => {
  const toastOptions = props.toastOptions ?? defaultToastOptions

  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={toastOptions}
      {...props}
    />
  )
}

export { Toaster }
