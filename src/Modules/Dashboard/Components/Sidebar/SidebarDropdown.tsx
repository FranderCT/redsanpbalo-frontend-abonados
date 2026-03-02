import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type DropdownItem = {
  label: string;
  onClick: () => void;
};

type SidebarDropdownProps = {
  icon: ReactNode;
  label: string;
  items: DropdownItem[];
  className?: string;
};

export default function SidebarDropdown({
  icon,
  label,
  items,
  className = "",
}: SidebarDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("click", onClickOutside);
    return () => window.removeEventListener("click", onClickOutside);
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring outline-none"
      >
        <span className="grid place-items-center">{icon}</span>
        <span className="transition-colors">{label}</span>
        <ChevronDown
          className={`ml-auto size-4 transition-transform group-hover:text-sidebar-accent-foreground ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="mt-1 ml-2 flex flex-col overflow-hidden rounded-md border border-sidebar-border bg-popover text-popover-foreground shadow-md max-h-64 overflow-y-auto"
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              role="menuitem"
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
              className="px-4 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground first:rounded-t-md last:rounded-b-md"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
