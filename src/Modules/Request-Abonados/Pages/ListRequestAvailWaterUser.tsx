import { useMemo, useState } from "react";
import { useGetAllRequestStates } from "../../Requests/StateRequest/Hooks/RequestStateHook";
import type { ReqAvailWater } from "../../Requests/RequestAvailabilityWater/Models/ReqAvailWater";
import ReqAvailWaterUserHeaderBar from "../Components/AvailabilityWater/ReqAvailWaterUserHeaderBar";
import ReqAvailWaterUserCards from "../Components/AvailabilityWater/ReqAvailWaterUserCards";
import { useGetMyReqAvailWater } from "../Hooks/AvailabilityWater/AvailabilityWaterHooks";
import { useGetUserProfile } from "../../Users/Hooks/UsersHooks";

const normalizeText = (value: unknown) =>
  String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export default function ListReqAvailWaterUser() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [stateRequestId, setStateRequestId] = useState<number | undefined>(undefined);

  const handleSearchChange = (text: string) => {
    setSearch(text);
    setPage(1);
  };

  const handleStateRequestChange = (id?: number) => {
    setStateRequestId(id);
    setPage(1);
  };

  const handleCleanFilters = () => {
    setSearch("");
    setStateRequestId(undefined);
    setPage(1);
  };

  const { requestStates = [], isPending: requestStatesLoading } = useGetAllRequestStates();
  const { data, isLoading, error } = useGetMyReqAvailWater();
  const { UserProfile } = useGetUserProfile();

  const allRows = useMemo<ReqAvailWater[]>(() => data ?? [], [data]);
  const filteredRows = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    return allRows.filter((row) => {
      const matchesState = stateRequestId ? row.StateRequest?.Id === stateRequestId : true;

      if (!matchesState) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const justification = normalizeText(row.Justification);
      const legacyJustification = normalizeText((row as ReqAvailWater & { justification?: string }).justification);
      const searchableText = [
        justification,
        legacyJustification,
        row.StateRequest?.Name,
        row.User?.Name,
        row.User?.Surname1,
        row.User?.Surname2,
        row.User?.IDcard,
        row.User?.Email,
        row.Date ? String(row.Date) : "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      return searchableText.includes(normalizedSearch);
    });
  }, [allRows, search, stateRequestId]);

  const total = filteredRows.length;
  const pageCount = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * limit;
  const paginatedRows = filteredRows.slice(start, start + limit);

  return (
    <div className="flex flex-col gap-6">
      <ReqAvailWaterUserHeaderBar
        limit={limit}
        total={total}
        search={search}
        requestStateId={stateRequestId}
        states={requestStates}
        statesLoading={requestStatesLoading}
        onStateRequestChange={handleStateRequestChange}
        onLimitChange={(value) => {
          setLimit(value);
          setPage(1);
        }}
        onSearchChange={handleSearchChange}
        onCleanFilters={handleCleanFilters}
      />

      <div>
        {isLoading ? (
          <div className="border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Cargando solicitudes…
          </div>
        ) : error ? (
          <div className="border border-red-200 bg-red-50 p-8 text-center text-red-600">
            Ocurrió un error al cargar las solicitudes.
          </div>
        ) : (
          <ReqAvailWaterUserCards
            data={paginatedRows}
            total={total}
            page={safePage}
            pageSize={limit}
            pageCount={pageCount}
            onPageChange={setPage}
            applicantName={`${UserProfile?.Name ?? ""} ${UserProfile?.Surname1 ?? ""} ${UserProfile?.Surname2 ?? ""}`.trim()}
          />
        )}
      </div>
    </div>
  );
}
