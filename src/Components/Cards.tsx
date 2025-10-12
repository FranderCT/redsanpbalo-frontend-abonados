import * as React from "react";

/** Card base */
export function Card({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        // base visual
        "rounded-xl border border-white/20 bg-white/5 text-white shadow-sm",
        // interacción
        "transition-all duration-200 hover:shadow-lg hover:border-white/30",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
        // layout
        "flex flex-col",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

/** Contenido (padding centralizado por defecto) */
export function CardContent({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["p-8 text-center", className].join(" ")} {...props} />;
}

/** Título */
export function CardTitle({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={[
        "text-xl font-extrabold leading-tight tracking-tight mb-3",
        "text-white",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

/** Descripción */
export function CardDescription({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={[
        "text-sm leading-relaxed text-white/85",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

/** Icono en círculo (coloca dentro cualquier SVG/icono) */
export function CardIcon({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full",
        "bg-white/20",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
