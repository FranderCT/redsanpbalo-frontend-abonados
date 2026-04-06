import { useQuery } from "@tanstack/react-query";
import { getAllAuditUsers } from "../Services/AuditUsersServices";
import type { AuditRecordScope } from "../Models/AuditUser";

export const useGetAllAuditUsers = (scope: AuditRecordScope | "all" = "all") => {
  const { data = [], isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["audit-users", scope],
    queryFn: getAllAuditUsers,
    select: (records) => (scope === "all" ? records : records.filter((record) => record.Scope === scope)),
    staleTime: 30_000,
  });

  return { auditUsers: data, isLoading, isError, error, refetch, isFetching };
};
