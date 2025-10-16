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
        className="group relative z-10 flex w-full items-center gap-3 px-4 py-2 transition-all hover:bg-[#091540] hover:text-white hover:translate-x-1 hover:shadow-md hover:shadow-[#091540]/40"
      >
        <span className="grid place-items-center">{icon}</span>
        <span className="transition-colors">{label}</span>
        <ChevronDown
          className={`ml-auto size-4 transition-transform group-hover:text-white ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="mt-1 ml-2 flex flex-col overflow-hidden border border-black/10 bg-white shadow-md max-h-64 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              role="menuitem"
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
              className="px-4 py-2 text-left transition-all hover:bg-[#091540] hover:text-white"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
