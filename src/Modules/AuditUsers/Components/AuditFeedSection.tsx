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
import type { AuditRecordScope, AuditUserMetadata, AuditUserRecord } from "../Models/AuditUser";

type AuditCategory = "INSERCIONES" | "ELIMINACIONES" | "ACTUALIZACIONES" | "OTROS";
type FilterTab = "TODAS" | AuditCategory;



const ITEMS_PER_PAGE = 8;

interface AuditRecordView {
  id: number;
  category: AuditCategory;
  action: string;
  author: string;
  objective: string;
  timestamp: string;
  source: string;
  outcome: string;
  changedFields: string[];
  searchableText: string;
}

interface AuditFeedSectionProps {
  scope?: AuditRecordScope | "all";
  title: string;
  description?: string;
  emptyMessage?: string;
  loadingLabel?: string;
}

interface AuditFilterTabsProps {
  activeFilter: FilterTab;
  onChange: (tab: FilterTab) => void;
  tabs: FilterTab[];
}

interface AuditItemProps {
  record: AuditRecordView;
}

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

function getMetadataStringValue(metadata: AuditUserMetadata | null, keys: string[]): string | null {
  if (!metadata) {
    return null;
  }

  const sources = [metadata.context, metadata.after, metadata.before];

  for (const source of sources) {
    if (!source) {
      continue;
    }

    for (const key of keys) {
      const value = source[key];
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }
  }

  return null;
}

function isTechnicalObjectiveLabel(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return /^(request[\w-]*#?\d+|[a-z_]+#\d+)$/u.test(normalized);
}

function getRequesterName(record: AuditUserRecord): string | null {
  const metadataRequester = getMetadataStringValue(record.Metadata, [
    "requesterName",
    "requestUserName",
    "applicantName",
    "usuarioSolicitante",
    "nombreSolicitante",
    "fullName",
    "userName",
    "name",
  ]);

  if (metadataRequester) {
    return metadataRequester;
  }

  const objectiveName = record.ObjectiveName?.trim();
  if (objectiveName && !isTechnicalObjectiveLabel(objectiveName)) {
    return objectiveName;
  }

  const target = formatSingleUserName(record.TargetUser);
  if (target !== "Sistema") {
    return target;
  }

  if (record.Scope === "request") {
    const author = getAuthorDisplayName(record);
    if (author !== "Sistema") {
      return author;
    }
  }

  return null;
}

function getObjectiveDisplayName(record: AuditUserRecord): string {
  const requester = getRequesterName(record);
  if (requester) {
    return requester;
  }

  if (record.Scope === "request") {
    return "Usuario asociado no disponible";
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
    .flatMap((segment) => segment.split("_"))
    .filter(Boolean)
    .join(" / ");
}

function formatChangedFields(metadata: AuditUserMetadata): string[] {
  return (metadata.changedFields ?? []).filter((field): field is string => Boolean(field));
}

function resolveActionLabel(record: AuditUserRecord, metadata: AuditUserMetadata): string {
  const changedFields = formatChangedFields(metadata);
  const removeStateChangeValues = (value: string): string => value.replace(/:\s*\d+\s*->\s*\d+\s*$/u, "").trim();

  if (record.Description?.trim()) {
    return removeStateChangeValues(record.Description);
  }

  if (changedFields.length > 0) {
    return removeStateChangeValues(`${record.Action} - ${changedFields.join(", ")}`);
  }

  return removeStateChangeValues(record.Action);
}

function mapActionToCategory(action: string): AuditCategory {
  if (action.includes("CREATE") || action.includes("INSERT")) return "INSERCIONES";
  if (action.includes("DELETE") || action.includes("REMOVE") || action.includes("DISABLE")) return "ELIMINACIONES";
  if (action.includes("UPDATE")) return "ACTUALIZACIONES";
  return "OTROS";
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
  const outcome = metadata.outcome ?? "SUCCESS";
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
      <div className="mt-0.5 shrink-0 md:mt-0">
        {actionIcons[record.category]}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900 md:text-base">{record.action}</p>
        <p className="mt-1 text-xs text-slate-500 md:text-sm">Autor: {record.author}</p>
        <p className="mt-1 text-xs text-slate-500 md:text-sm">Afectado: {record.objective}</p>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-500 md:text-xs">
          <Clock3 className="size-3.5" aria-hidden="true" />
          <span>{record.timestamp}</span>
        </div>
      </div>

    </article>
  );
}

export default function AuditFeedSection({
  scope = "all",
  title,
  description,
  emptyMessage = "No hay registros para los filtros seleccionados.",
  loadingLabel = "Cargando auditorias...",
}: AuditFeedSectionProps) {
  const { auditUsers, isLoading, isError, error } = useGetAllAuditUsers(scope);
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
    <section className="space-y-4 md:space-y-6">
      <header className="space-y-2">
        <div>
          <h2 className="text-2xl font-bold text-[#091540]">{title}</h2>
          {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
        </div>
        <div className="border-b border-dashed border-gray-300 pt-2" />
      </header>

      <section className="space-y-4">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id={`audit-search-${scope}`}
            type="search"
            value={searchTerm}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Buscar por accion, usuario, origen o campo..."
            className="w-full border border-slate-200 px-3 py-2 pl-9 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
            <span>{loadingLabel}</span>
          </div>
        ) : isError ? (
          <div className="border border-dashed border-rose-300 bg-rose-50 p-8 text-center text-sm text-rose-700">
            No se pudieron cargar las auditorias.
          </div>
        ) : filteredRecords.length > 0 ? (
          paginatedRecords.map((record) => <AuditItem key={record.id} record={record} />)
        ) : (
          <div className="border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            {emptyMessage}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between border border-slate-200 bg-white p-3 shadow-sm sm:max-w-md">
          <button
            type="button"
            onClick={() => setCurrentPage((previousPage) => Math.max(1, previousPage - 1))}
            disabled={currentPage === 1 || isLoading}
            className="inline-flex size-10 items-center justify-center border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
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
            className="inline-flex size-10 items-center justify-center border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Pagina siguiente"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </section>
    </section>
  );
}
