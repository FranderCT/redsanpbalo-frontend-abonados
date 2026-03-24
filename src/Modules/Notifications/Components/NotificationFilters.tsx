import { Search } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { cn } from "@/lib/utils";
import type { NotificationFilter } from "../Types/Notification";

type NotificationFiltersProps = {
  searchTerm: string;
  activeFilter: NotificationFilter;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: NotificationFilter) => void;
};

const FILTERS: Array<{ label: string; value: NotificationFilter }> = [
  { label: "Todas", value: "ALL" },
  { label: "Leidas", value: "READ" },
  { label: "No leidas", value: "UNREAD" },
];

export default function NotificationFilters({
  searchTerm,
  activeFilter,
  onSearchChange,
  onFilterChange,
}: NotificationFiltersProps) {
  return (
    <section className="border bg-white rounded-none p-4 md:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por asunto o descripcion..."
            className="pl-9 h-11 rounded-none border-slate-300 bg-white text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.value;

            return (
              <Button
                key={filter.value}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onFilterChange(filter.value)}
                className={cn(
                  "rounded-none border border-transparent px-4 uppercase tracking-wide",
                  isActive
                    ? "bg-[#091540] text-white hover:bg-[#091540]/95 hover:text-white"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {filter.label}
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
