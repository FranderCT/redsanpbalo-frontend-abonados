import { startTransition, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Clock3,
  LoaderCircle,
  Pencil,
  Search,
  Settings,
  Trash2,
} from "lucide-react";
import { showApiErrorToast } from "@/core/api-error";
import { useGetAllAuditUsers } from "../Hooks/AuditUsersHooks";
import type { AuditUserMetadata, AuditUserRecord } from "../Models/AuditUser";

type AuditCategory = "INSERCIONES"| "ELIMINACIONES" | "ACTUALIZACIONES" | "OTROS";
type AuditImpact = "EXITOSO" | "FALLIDO" | "SISTEMA" | "ALTO IMPACTO" | "MEDIO";
type FilterTab = "TODAS" | AuditCategory;

const ITEMS_PER_PAGE = 8;

interface AuditRecordView {
  id: number;
  category: AuditCategory;
  action: string;
  author: string;
  objective: string;
  timestamp: string;
  impact: AuditImpact;
  rawAction: string;
  source: string;
  outcome: string;
  changedFields: string[];
  searchableText: string;
}

interface StatCardProps {
  label: string;
  value: string;
  helperText: string;
  helperTone?: "positive" | "neutral";
}

interface AuditFilterTabsProps {
  activeFilter: FilterTab;
  onChange: (tab: FilterTab) => void;
  tabs: FilterTab[];
}

interface AuditItemProps {
  record: AuditRecordView;
}

const impactStyles: Record<AuditImpact, string> = {
  EXITOSO: "bg-emerald-100 text-emerald-700",
  FALLIDO: "bg-amber-100 text-amber-700",
  SISTEMA: "bg-slate-200 text-slate-700",
  "ALTO IMPACTO": "bg-rose-100 text-rose-700",
  MEDIO: "bg-blue-100 text-blue-700",
};

const actionIcons: Record<AuditCategory, ReactNode> = {
  INSERCIONES: <Activity className="size-4 text-blue-700" aria-hidden="true" />,
  ELIMINACIONES: <Trash2 className="size-4 text-rose-700" aria-hidden="true" />,
  ACTUALIZACIONES: <Pencil className="size-4 text-indigo-700" aria-hidden="true" />,
  OTROS: <Settings className="size-4 text-amber-700" aria-hidden="true" />,
};

function formatSingleUserName(user: AuditUserRecord["ActorUser"]): string {
  if (!user) {
    return "Sistema";
  }

  return [user.Name, user.Surname1].filter(Boolean).join(" ").trim();
}

function getAuthorDisplayName(record: AuditUserRecord): string {
  if (record.AuthorName?.trim()) {
    return record.AuthorName.trim();
  }

  const actor = formatSingleUserName(record.ActorUser);
  if (actor !== "Sistema") {
    return actor;
  }

  if (record.Actor?.name?.trim()) {
    return record.Actor.name.trim();
  }

  if (record.Actor?.email?.trim()) {
    return record.Actor.email.trim();
  }

  return "Sistema";
}

function getObjectiveDisplayName(record: AuditUserRecord): string {
  if (record.ObjectiveName?.trim()) {
    return record.ObjectiveName.trim();
  }

  const target = formatSingleUserName(record.TargetUser);
  if (target !== "Sistema") {
    return target;
  }

  return `${record.EntityName}${record.RecordId ? ` #${record.RecordId}` : ""}`;
}

function formatAuthorSummary(record: AuditUserRecord): string {
  const actor = getAuthorDisplayName(record);
  const target = getObjectiveDisplayName(record);

  if (record.ActorUserId && record.TargetUserId && record.ActorUserId !== record.TargetUserId) {
    return `${actor} -> ${target}`;
  }

  return actor !== "Sistema" ? actor : target;
}

function getMetadata(record: AuditUserRecord): AuditUserMetadata {
  return record.Metadata ?? {};
}

function formatSource(source: string | null | undefined): string {
  if (!source) {
    return "Sin origen";
  }

  return source
    .split(".")
    .filter(Boolean)
    .join(" / ");
}

function formatChangedFields(metadata: AuditUserMetadata): string[] {
  return (metadata.changedFields ?? []).filter((field): field is string => Boolean(field));
}

function resolveActionLabel(record: AuditUserRecord, metadata: AuditUserMetadata): string {
  const changedFields = formatChangedFields(metadata);

  if (changedFields.length > 0) {
    return `${record.Description || record.Action} - ${changedFields.join(", ")}`;
  }

  return record.Description || record.Action;
}

function mapActionToCategory(action: string): AuditCategory {
  if (action.includes("CREATE") || action.includes("INSERT")) return "INSERCIONES";
  if (action.includes("DELETE") || action.includes("REMOVE") || action.includes("DISABLE")) return "ELIMINACIONES";
  if (action.includes("UPDATE")) return "ACTUALIZACIONES";
  return "OTROS";
}

function mapActionToImpact(action: string, metadata: AuditUserMetadata): AuditImpact {
  if (metadata.outcome && metadata.outcome !== "SUCCESS") return "FALLIDO";
  if (action.includes("LOGIN")) return "SISTEMA";
  if (action.includes("DELETE") || action.includes("REMOVE") || action.includes("DISABLE")) return "ALTO IMPACTO";
  if (action.includes("UPDATE")) return "MEDIO";
  return "EXITOSO";
}

function formatTimestamp(dateInput: string): string {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-CR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function mapAuditRecord(record: AuditUserRecord): AuditRecordView {
  const metadata = getMetadata(record);
  const changedFields = formatChangedFields(metadata);
  const source = formatSource(metadata.source ?? record.TableName ?? record.Module);
  const outcome = metadata.outcome ?? "UNKNOWN";
  const actionLabel = resolveActionLabel(record, metadata);
  const author = formatAuthorSummary(record);
  const objective = getObjectiveDisplayName(record);

  return {
    id: record.Id,
    category: mapActionToCategory(record.Action),
    action: actionLabel,
    author,
    objective,
    timestamp: formatTimestamp(record.CreatedAt),
    impact: mapActionToImpact(record.Action, metadata),
    rawAction: record.Action,
    source,
    outcome,
    changedFields,
    searchableText: [
      actionLabel,
      author,
      objective,
      record.Action,
      record.EntityName,
      String(record.RecordId ?? ""),
      source,
      outcome,
      changedFields.join(" "),
    ]
      .join(" ")
      .toLowerCase(),
  };
}

function StatCard({ label, value, helperText, helperTone = "neutral" }: StatCardProps) {
  return (
    <article className="border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <p className="text-[11px] font-semibold tracking-[0.08em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      <p className={`mt-2 text-sm font-semibold ${helperTone === "positive" ? "text-emerald-600" : "text-slate-500"}`}>
        {helperText}
      </p>
      <div className="mt-4 h-[2px] w-full bg-slate-900/80" />
    </article>
  );
}

function AuditFilterTabs({ activeFilter, onChange, tabs }: AuditFilterTabsProps) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {tabs.map((tab) => {
        const active = activeFilter === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`shrink-0 px-4 py-2 text-xs font-semibold tracking-wide transition-colors md:text-sm ${
              active
                ? "bg-[#133A6B] text-white"
                : "border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

function AuditItem({ record }: AuditItemProps) {
  return (
    <article className="flex items-start gap-3 border border-slate-200 bg-white p-4 shadow-sm md:items-center md:gap-4 md:p-5">
      <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center bg-slate-100 md:mt-0">
        {actionIcons[record.category]}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900 md:text-base">{record.action}</p>
        <p className="mt-1 text-xs text-slate-500 md:text-sm">Autor: {record.author}</p>
        <p className="mt-1 text-xs text-slate-500 md:text-sm">Objetivo: {record.objective}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="inline-flex bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
            {record.source}
          </span>
          <span className="inline-flex bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
            {record.outcome}
          </span>
          {record.changedFields.map((field) => (
            <span
              key={field}
              className="inline-flex bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-700"
            >
              {field}
            </span>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-500 md:text-xs">
          <Clock3 className="size-3.5" aria-hidden="true" />
          <span>{record.timestamp}</span>
        </div>
      </div>

      <span
        className={`inline-flex shrink-0 px-3 py-1 text-[10px] font-bold tracking-wide md:text-xs ${impactStyles[record.impact]}`}
      >
        {record.impact}
      </span>
    </article>
  );
}

const UserAuditPage = () => {
  const { auditUsers, isLoading, isError, error } = useGetAllAuditUsers();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("TODAS");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (isError) {
      showApiErrorToast(error);
    }
  }, [error, isError]);

  const records = useMemo(() => auditUsers.map(mapAuditRecord), [auditUsers]);

  const availableTabs = useMemo<FilterTab[]>(() => {
    const categories = Array.from(new Set(records.map((record) => record.category)));
    return ["TODAS", ...categories];
  }, [records]);

  const filteredRecords = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return records.filter((record) => {
      const byCategory = activeFilter === "TODAS" ? true : record.category === activeFilter;
      const bySearch = normalizedSearch.length === 0 || record.searchableText.includes(normalizedSearch);

      return byCategory && bySearch;
    });
  }, [activeFilter, records, searchTerm]);

  useEffect(() => {
    const nextPageCount = Math.max(1, Math.ceil(filteredRecords.length / ITEMS_PER_PAGE));
    if (currentPage > nextPageCount) {
      setCurrentPage(nextPageCount);
    }
  }, [currentPage, filteredRecords.length]);

  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / ITEMS_PER_PAGE));

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, filteredRecords]);


  const totalSuccessful = records.filter((record) => record.outcome === "SUCCESS").length;
  const handleSearchChange = (value: string) => {
    startTransition(() => {
      setSearchTerm(value);
      setCurrentPage(1);
    });
  };

  const handleFilterChange = (tab: FilterTab) => {
    startTransition(() => {
      setActiveFilter(tab);
      setCurrentPage(1);
    });
  };

  return (
    <section className="mx-auto flex min-w-0 max-w-5xl flex-col space-y-4 overflow-x-hidden p-4 sm:p-6 md:space-y-6">
      <header className="space-y-3">
        <div>
          <h1 className="text-2xl font-bold text-[#091540]">Auditorias</h1>
        </div>
        <div className="border-b border-dashed border-gray-300 pt-2" />
      </header>

      <section className="grid gap-3 md:grid-cols-2 md:gap-4">
          <StatCard
            label="TOTAL DE ACCIONES"
            value={records.length.toLocaleString("es-CR")}
            helperText={`${totalSuccessful.toLocaleString("es-CR")} exitosas`}
            helperTone="positive"
          />
          {/* <StatCard
            label="TRAZAS RELEVANTES"
            value={totalChangedFields.toLocaleString("es-CR")}
            helperText={`${totalAffectedUsers.toLocaleString("es-CR")} usuarios impactados`}
          /> */}
      </section>

      <section className="space-y-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              id="audit-search"
              type="search"
              value={searchTerm}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Buscar por accion, usuario, origen o campo..."
              className="pl-9 w-full border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Buscar auditorias"
            />
          </div>
      </section>

      <section>
          <AuditFilterTabs activeFilter={activeFilter} onChange={handleFilterChange} tabs={availableTabs} />
      </section>

      <section className="space-y-3 md:space-y-4 [content-visibility:auto]">
          {isLoading ? (
            <div className="flex items-center justify-center gap-3 border border-slate-200 bg-white p-8 text-sm font-medium text-slate-500 shadow-sm">
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              <span>Cargando auditorias de usuarios...</span>
            </div>
          ) : isError ? (
            <div className="border border-dashed border-rose-300 bg-rose-50 p-8 text-center text-sm text-rose-700">
              No se pudieron cargar las auditorias
            </div>
          ) : filteredRecords.length > 0 ? (
            paginatedRecords.map((record) => <AuditItem key={record.id} record={record} />)
          ) : (
            <div className="border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              No hay registros para los filtros seleccionados.
            </div>
          )}
      </section>

      <section>
          <div className="flex items-center justify-between border border-slate-200 bg-white p-3 shadow-sm sm:max-w-md">
            <button
              type="button"
              onClick={() => setCurrentPage((previousPage) => Math.max(1, previousPage - 1))}
              disabled={currentPage === 1 || isLoading}
              className="inline-flex size-10 items-center justify-center border border-slate-200 bg-slate-50 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-100"
              aria-label="Pagina anterior"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>

            <p className="text-xs font-semibold tracking-[0.06em] text-slate-600 md:text-sm">
              PAGINA {currentPage} DE {pageCount}
            </p>

            <button
              type="button"
              onClick={() => setCurrentPage((previousPage) => Math.min(pageCount, previousPage + 1))}
              disabled={currentPage === pageCount || isLoading}
              className="inline-flex size-10 items-center justify-center border border-slate-200 bg-slate-50 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-100"
              aria-label="Pagina siguiente"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
      </section>
    </section>
  );
};

export default UserAuditPage;
